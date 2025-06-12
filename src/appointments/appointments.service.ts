import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { DataSource, Repository } from 'typeorm';
import { Slot } from 'src/availabilities/entities/Slot';
import { Patient } from 'src/patients/entities/patients.entity';
import { Professional } from 'src/professional/entities/profesional.entity';
import { Treatment } from 'src/treatments/entities/treatment.entity';
import { ProfessionalAvailability } from 'src/availabilities/entities/ProfessionalAvailability';


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
      // buscamos el slot 
      const slot = await manager.getRepository(Slot).findOne({
        where: { id: createAppointmentDto.slot_id },
      });

      if (!slot) {
        throw new Error('Slot no encontrado');
      }

    // buscamos la disponibilidad exacta
    const availability = await manager
      .getRepository(ProfessionalAvailability)
      .createQueryBuilder('av')//alias
      .where('av.professional_id = :profeId', { profeId: createAppointmentDto.professional_id })
      .andWhere('av.slot_id = :slot', { slot: createAppointmentDto.slot_id })
      .andWhere('av.date_availability = :date', { date: createAppointmentDto.date_appointments })
      .andWhere('av.status_availability != :status', { status: 'libre' })
      .getOne();
      console.log("Datos disponibilidad", createAppointmentDto.professional_id );
      console.log("Datos disponibilidad", createAppointmentDto.slot_id );
      console.log("Datos disponibilidad", createAppointmentDto.date_appointments );
      console.log("Availability",availability )

    if (!availability) {
      throw new Error('Disponibilidad profesional no encontrada para este slot');
    }

    if (availability.status === 'reservado') {
      throw new Error('Slot ya está reservado');
    }
    // para cargar las columnas relacionadas
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

    // crea la reserva
    const appointment = manager
      .getRepository(Appointment)
      .create({
        patient,
        slot,
        professional,
        treatment,
        date_appointments : createAppointmentDto.date_appointments,
        duration_minutes_appointments : createAppointmentDto.duration_minutes_appointments,
        status_appointments : createAppointmentDto.status_appointments,
        cancellation_reason_appointments : createAppointmentDto.cancellation_reason_appointments,
        created_by_appointments : createAppointmentDto.created_by_appointments,
      });
      const savedAppointment = await manager.getRepository(Appointment).save(appointment);

      // actualiza la disponibilidad como reservada
      availability.status = 'reservado';
      await manager.getRepository(ProfessionalAvailability).save(availability);

      return savedAppointment;
    });
  }
}
