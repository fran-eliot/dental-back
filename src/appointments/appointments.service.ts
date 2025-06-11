import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { DataSource, Repository } from 'typeorm';
import { Slot } from 'src/availabilities/entities/Slot';
import { Patient } from 'src/patients/entities/patients.entity';
import { Professional } from 'src/professional/entities/profesional.entity';
import { Treatment } from 'src/treatments/entities/treatment.entity';


@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment) private readonly appointmentRepository:Repository<Appointment>,
    @InjectRepository(Slot)
    private readonly slotRepository: Repository<Slot>,
    private readonly dataSource: DataSource,
  ){}

  //Creamos nueva reserva, hay que tener en cuenta que cuando seleccione un slot este se tiene que actualizar en availabilities
  async newAppointment(createAppointmentDto:CreateAppointmentDto):Promise<Appointment>{
    //dataSource es la instancia de TypeORM que representa la conexión a la base de datos.
    //Esta instancia tiene métodos para interactuar con la base, como transaction()
    //Permite ejecutar varias operaciones dentro de una transacción
    return await this.dataSource.transaction(async (manager) => {
      // 1. Buscar el slot con su disponibilidad relacionada
      const slot = await manager.findOne(Slot, {
        where: { id: createAppointmentDto.slot_id },
        relations: ['professionalAvailabilities'], // Cargar disponibilidad
      });

      if (!slot) {
        throw new Error('Slot no encontrado');
      }

      const availability = slot.professionalAvailabilities[0]; // Suponiendo que solo hay una por slot

      if (!availability) {
        throw new Error('Disponibilidad profesional no encontrada para este slot');
      }

      if (availability.status === 'reservado') {
        throw new Error('Slot ya está reservado');
      }
      // Cargar entidades
      const patient = await manager.findOneOrFail(Patient, {
        where: { id_patients: createAppointmentDto.patient_id },
      });

      const professional = createAppointmentDto.professional_id
        ? await manager.findOne(Professional, {
            where: { id_professionals: createAppointmentDto.professional_id },
          })
        : null;

      const treatment = createAppointmentDto.treatments_id
        ? await manager.findOne(Treatment, {
            where: { id_treatments: createAppointmentDto.treatments_id },
          })
        : null;

      // Crear la cita
      const appointment = new Appointment();
      appointment.patient = patient;
      appointment.slot = slot;
      appointment.professional = professional;
      appointment.treatment = treatment;
      appointment.date_appointments = createAppointmentDto.date_appointments;
      appointment.duration_minutes_appointments = createAppointmentDto.duration_minutes_appointments;
      appointment.status_appointments = createAppointmentDto.status_appointments;
      appointment.cancellation_reason_appointments = createAppointmentDto.cancellation_reason_appointments;
      appointment.created_by_appointments = createAppointmentDto.created_by_appointments;

      const savedAppointment = await manager.save(appointment);

      // 3. Marcar la disponibilidad como reservada
      availability.status = 'reservado';
      await manager.save(availability);

      return savedAppointment;
    });
  }
}
