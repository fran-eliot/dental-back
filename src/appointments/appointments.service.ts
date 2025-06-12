import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { DataSource, Repository } from 'typeorm';
import { Slot } from 'src/availabilities/entities/Slot';
import { Patient } from 'src/patients/entities/patients.entity';
import { Professional } from 'src/professional/entities/profesional.entity';
import { Treatment } from 'src/treatments/entities/treatment.entity';
import { ProfessionalAvailability } from 'src/availabilities/entities/ProfessionalAvailability';
import { FindAppointmentDto } from './dtos/find-appointment.dto';
import { AppointmentResponseDto } from './dtos/response-appointment.dto';


@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment) private readonly appointmentRepository:Repository<Appointment>,
    @InjectRepository(Slot)
    private readonly slotRepository: Repository<Slot>,
    private readonly dataSource: DataSource,
  ){}

  //Para calcular los slots que necesito para los tratamientos
  private calculateSlotDuration(slot: Slot): number {
    const start = new Date(`2000-01-01T${slot.startTime}`);
    const end = new Date(`2000-01-01T${slot.endTime}`);
    return (end.getTime() - start.getTime()) / (1000 * 60); // minutos
  }

  //Creamos nueva reserva, hay que tener en cuenta que cuando seleccione un slot este se tiene que actualizar en availabilities
  async newAppointment(createAppointmentDto:CreateAppointmentDto):Promise<Appointment>{
    //dataSource es la instancia de TypeORM que representa la conexión a la base de datos.
    //Esta instancia tiene métodos para interactuar con la base, como transaction()
    //Permite ejecutar varias operaciones dentro de una transacción
    return await this.dataSource.transaction(async (manager) => {
      const {
        professional_id,
        date_appointments,
        slot_id,
        duration_minutes_appointments,
        patient_id,
        treatments_id,
        status_appointments,
        cancellation_reason_appointments,
        created_by_appointments,
      } = createAppointmentDto;

      // 1. Obtener todos los slots ordenados por hora desde el slot actual
      const allSlots = await manager
        .getRepository(ProfessionalAvailability)
        .createQueryBuilder('av')
        .leftJoinAndSelect('av.slot', 'slot')
        .where('av.professional = :proId', { proId: professional_id })
        .andWhere('av.date = :date', { date: date_appointments })
        .andWhere('av.status = :status', { status: 'libre' })
        .orderBy('slot.startTime', 'ASC')
        .getMany();

      // 2. Encontrar el índice del slot inicial solicitado
      const startIndex = allSlots.findIndex(av => av.slot.id === slot_id);

      if (startIndex === -1) {
        throw new BadRequestException('El slot inicial no está disponible o no existe');
      }

      // 3. Acumular minutos hasta cumplir con la duración
      let totalMinutes = 0;
      const slotsToReserve: ProfessionalAvailability[] = [];

      for (let i = startIndex; i < allSlots.length; i++) {
        const slot = allSlots[i];
        // Validar consecutividad (excepto el primer slot)
        if (slotsToReserve.length > 0) {
          const prevSlot = slotsToReserve[slotsToReserve.length - 1].slot;
          if (prevSlot.endTime !== slot.slot.startTime) {
            // Hay una discontinuidad entre slots => romper y error
            break; 
          }
        }
        const minutes = this.calculateSlotDuration(slot.slot);

        slotsToReserve.push(slot);
        totalMinutes += minutes;

        if (totalMinutes >= duration_minutes_appointments) break;
      }

      if (totalMinutes < duration_minutes_appointments) {
        throw new BadRequestException('No hay suficientes bloques de tiempo contiguos disponibles');
      }

      // 4. Buscar entidades relacionadas
      const patient = await manager.findOneOrFail(Patient, { where: { id_patients: patient_id } });
      const professional = await manager.findOneOrFail(Professional, { where: { id_professionals: professional_id } });
      const treatment = treatments_id
        ? await manager.findOne(Treatment, { where: { id_treatments: treatments_id } })
        : null;

      // 5. Crear la entidad Appointment
      const appointment = new Appointment();
      appointment.patient = patient;
      appointment.professional = professional;
      appointment.treatment = treatment;
      appointment.slot = slotsToReserve[0].slot;  // Siempre se guarda el slot inicial
      appointment.date_appointments = date_appointments;
      appointment.duration_minutes_appointments = duration_minutes_appointments;
      appointment.status_appointments = status_appointments;
      appointment.cancellation_reason_appointments = cancellation_reason_appointments;
      appointment.created_by_appointments = created_by_appointments;

      // 6. Guardar la cita
      const savedAppointment = await manager.save(appointment);

      // 7. Marcar los slots como reservados
      for (const availability of slotsToReserve) {
        availability.status = 'reservado';
        // Si quieres, aquí guardar appointment.id en availability para relacionarlo (opcional)
        await manager.save(availability);
      }

      return savedAppointment;
    });
  }

  //Nos traemos toda las reservas
  async findAppointments(filters: {date_appointments?: string, professional_id?:number}): Promise<AppointmentResponseDto[]> {
    const query = this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('appointment.professional', 'professional')
      .leftJoinAndSelect('appointment.treatment', 'treatment')
      .leftJoinAndSelect('appointment.slot', 'slot');

    // Aplicar filtros dinámicamente
    if (filters.professional_id) {
      query.andWhere('professional.id_professionals = :professionalId', {
        professionalId: filters.professional_id,
      });
    }

    if (filters.date_appointments) {
      query.andWhere('appointment.date_appointments = :date', {
        date: filters.date_appointments,
      });
    }

    const appointments = await query.getMany();

    // Mapea los resultados con los datos que necesito
    return appointments.map(app => {
      //Calcular hora_fin a partir de startTime y duration_minutes_appointments
      let hours = 0;
      let minutes = 0;

      if (app.slot && app.slot.startTime) {
        const timeParts = app.slot.startTime.split(':').map(Number);
        hours = timeParts[0];
        minutes = timeParts[1];
      }

      const startDate = new Date();
      startDate.setHours(hours, minutes, 0, 0);

      const duration = app.duration_minutes_appointments || 0;
      const endDate = new Date(startDate.getTime() + duration * 60000);
      const hora_fin = endDate.toTimeString().substring(0, 5); // HH:MM

      return {
        id_reserva: app.id_appointments,
        paciente: `${app.patient.name_patients} ${app.patient.last_name_patients}`,
        profesional: `${app.professional.name_professionals} ${app.professional.last_name_professionals}`,
        tratamiento: app.treatment?.name_treatments ?? 'N/A',
        fecha_cita: app.date_appointments,
        hora_inicio: app.slot?.startTime ?? 'N/A',
        hora_fin,
        periodo: app.slot?.period,
        duracion: app.duration_minutes_appointments,
        estado: app.status_appointments,
        motivo_cancelacion: app.cancellation_reason_appointments ?? '',
        creado_por: app.created_by_appointments,
      };
    });
  }
}
