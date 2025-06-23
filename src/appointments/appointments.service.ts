import { App } from 'supertest/types';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { DataSource, Repository } from 'typeorm';
import { Slot } from 'src/availabilities/entities/Slot';
import { Patient } from 'src/patients/entities/patient.entity';
import { Professional } from 'src/professional/entities/profesional.entity';
import { Treatment } from 'src/treatments/entities/treatment.entity';
import { ProfessionalAvailability } from 'src/availabilities/entities/ProfessionalAvailability';
import { FindAppointmentDto } from './dtos/find-appointment.dto';
import { HistoryAppointmentDto } from './dtos/history-appointment.dto';
import { UpdateAppointmentDto } from './dtos/update-appointment.dto';
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
  //Para verificar las reservas por paciente, fecha y status
  private async verifyAppointment(
    manager: any,
    patient_id: number,
    date: string,
    startTime: string
  ): Promise<void> {
    const overlappingAppointment = await manager
      .getRepository(Appointment)
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.slot', 'slot')
      .where('a.patient = :patientId', { patientId: patient_id })
      .andWhere('a.date_appointments = :date', { date })
      .andWhere('slot.startTime = :startTime', { startTime })
      .andWhere('a.status_appointments IN (:...activeStatuses)', {
        activeStatuses: ['pendiente', 'confirmada', 'realizada'],
      })
      .getOne();

    if (overlappingAppointment) {
      throw new BadRequestException(
        'Ya existe una cita activa para este paciente en esa fecha y hora.'
      );
    }
  }

  //Nos traemos todas las reservas sin paginar
  async findAppointmentsAll(filters: {date_appointments?: string, professional_id?:number}): Promise<AppointmentResponseDto[]> {
    const query = this.appointmentRepository
    .createQueryBuilder('appointment')
    .leftJoinAndSelect('appointment.patient', 'patient')
    .leftJoinAndSelect('appointment.professional', 'professional')
    .leftJoinAndSelect('appointment.slot', 'slot')
    .leftJoinAndSelect('appointment.treatment', 'treatment');

    // Aplicar filtros si existen
    if (filters.professional_id) {
      query.andWhere('appointment.professional = :professional_id', { professional_id: filters.professional_id });
    }

    if (filters.date_appointments) {
      query.andWhere('DATE(appointment.date_appointments) = :date_appointments', {
        date_appointments: filters.date_appointments,
      });
    }

    const appointments = await query.getMany();

    return appointments.map(app => {
      const duration = app.duration_minutes_appointments || 0;
      const appointmentDate = new Date(app.date_appointments);
      const endDate = new Date(appointmentDate.getTime() + duration * 60000);
      const hora_inicio = app.slot?.startTime ? app.slot.startTime.substring(0, 5) : 'N/A';
      const hora_fin = endDate.toTimeString().substring(0, 5);

      return {
        id_reserva: app.id_appointments,
        paciente: app.patient
          ? `${app.patient.name_patients} ${app.patient.last_name_patients}`
          : 'N/A',
        paciente_id: app.patient?.id_patients ?? 0,
        profesional: app.professional
          ? `${app.professional.name_professionals} ${app.professional.last_name_professionals}`
          : 'N/A',
        tratamiento: app.treatment?.name_treatments ?? 'N/A',
        fecha_cita: app.date_appointments,
        hora_inicio,
        hora_fin,
        periodo: app.slot?.period,
        duracion: duration,
        estado: app.status_appointments,
        motivo_cancelacion: app.cancellation_reason_appointments ?? '',
        creado_por: app.created_by_appointments,
      };
    });
  }
  //Trae todas las reservas sin filtros
  async getAllAppointments(): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      relations: ['patient', 'professional', 'treatment', 'slot'],
    });
  }

  //Nos traemos toda las reservas filtradas por id_professional y fecha //Cuidado que estan paginadas
  async findAppointments(filters: {date_appointments?: string, professional_id?:number, page?: number,
  pageSize?: number}): Promise<{
    data: AppointmentResponseDto[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    
    const {
      date_appointments,
      professional_id,
      page = 1,
      pageSize = 10
    } = filters;

    const skip = (page - 1) * pageSize;

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

    const [appointments, total] = await query
      .orderBy('appointment.date_appointments', 'DESC')
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();

    // Mapea los resultados con los datos que necesito
    const data = appointments.map(app => {
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
      const hora_inicio = app.slot?.startTime ? app.slot.startTime.substring(0, 5) : 'N/A';
      const hora_fin = endDate.toTimeString().substring(0, 5); // HH:MM

      return {
        id_reserva: app.id_appointments,
        paciente: `${app.patient.name_patients} ${app.patient.last_name_patients}`,
        paciente_id: app.patient.id_patients,
        profesional: `${app.professional.name_professionals} ${app.professional.last_name_professionals}`,
        tratamiento: app.treatment?.name_treatments ?? 'N/A',
        fecha_cita: app.date_appointments,
        hora_inicio,
        hora_fin,
        periodo: app.slot?.period,
        duracion: app.duration_minutes_appointments,
        estado: app.status_appointments,
        motivo_cancelacion: app.cancellation_reason_appointments ?? '',
        creado_por: app.created_by_appointments,
      };
    });
    return {
      data,
      total,
      page,
      pageSize
    };
  }

//Para buscar citas por rango de fechas y profesional
//Este método es para el calendario de citas, donde se pueden buscar por rango de fechas y profesional
//Se puede buscar por rango de fechas, por profesional o ambos
//Si no se pasa ningún filtro, devuelve todas las citas
async findAppointmentsByDates(filters: {
    startDate?: string;
    endDate?: string;
    professional_id?: number;
  }): Promise<AppointmentResponseDto[]> {

    const query = this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('appointment.professional', 'professional')
      .leftJoinAndSelect('appointment.treatment', 'treatment')
      .leftJoinAndSelect('appointment.slot', 'slot');

    if (filters.professional_id) {
      query.andWhere('professional.id_professionals = :professionalId', {
        professionalId: filters.professional_id,
      });
    }

    if (filters.startDate && filters.endDate) {
      query.andWhere('appointment.date_appointments BETWEEN :start AND :end', {
        start: filters.startDate,
        end: filters.endDate,
      });
    } else if (filters.startDate) {
      query.andWhere('appointment.date_appointments >= :start', {
        start: filters.startDate,
      });
    } else if (filters.endDate) {
      query.andWhere('appointment.date_appointments <= :end', {
        end: filters.endDate,
      });
    }

    if (!filters.startDate || !filters.endDate) {
      throw new BadRequestException('Se requieren start_date y end_date');
  }
    console.log('Consultando con:', filters.startDate, filters.endDate);
    const appointments = await query.getMany();

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
        paciente_id: app.patient?.id_patients ?? 0,
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

  //Para historial del paciente
  async findAppointmentsByPatient(patient_id: number): Promise<HistoryAppointmentDto[]> {
    const appointments = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('appointment.professional', 'professional')
      .leftJoinAndSelect('appointment.treatment', 'treatment')
      .where('appointment.patient_id = :patientId', { patientId: patient_id })
      // opcional: solo confirmadas, si quieres:
      // .andWhere('appointment.status_appointments = :status', { status: 'confirmada' })
      .orderBy('appointment.date_appointments', 'DESC')
      .getMany();

    return appointments.map(app => ({
      id_reserva: app.id_appointments,
      paciente_id: app.patient.id_patients,
      paciente: `${app.patient.name_patients} ${app.patient.last_name_patients}`,
      fecha_cita: app.date_appointments,
      tratamiento: app.treatment?.name_treatments ?? 'N/A',
      motivo_cancelacion: app.cancellation_reason_appointments ?? '',
      profesional: `${app.professional.name_professionals} ${app.professional.last_name_professionals}`,
    }));
  }

  //Actualizar estado/motivo y si es cancelada que me libere los slots de disponibilidades
  async updateAppointmentStatus(id_appointments: number, updateDto: UpdateAppointmentDto): Promise<Appointment> {
    return await this.dataSource.transaction(async (manager) => {
      const appointment = await manager.findOne(Appointment, {
        where: { id_appointments },
        relations: ['slot', 'professional'],
      });

      if (!appointment) {
        throw new BadRequestException('La reserva no existe');
      }

      const previousStatus = appointment.status_appointments;
      appointment.status_appointments = updateDto.status_appointments;

      // Actualizar cancellation_reason_appointments si viene en el DTO
      if (updateDto.cancellation_reason_appointments !== undefined) {
        appointment.cancellation_reason_appointments = updateDto.cancellation_reason_appointments;
      }

      const updatedAppointment = await manager.save(appointment);

      // Si cambia a cancelada, liberar slots
      if (
        previousStatus !== 'cancelada' &&
        updateDto.status_appointments === 'cancelada'
      ) {
        const availabilitiesToFree = await manager
          .getRepository(ProfessionalAvailability)
          .createQueryBuilder('av')
          .leftJoinAndSelect('av.slot', 'slot')
          .where('av.professional = :professionalId', {
            professionalId: appointment.professional.id_professionals,
          })
          .andWhere('av.date = :date', {
            date: appointment.date_appointments,
          })
          .andWhere('slot.start_time_slots >= :startTime', {
            startTime: appointment.slot.startTime,
          })
          .andWhere('av.status = :status', { status: 'reservado' })
          .orderBy('slot.startTime', 'ASC')
          .getMany();

        let totalMinutes = 0;
        const slotsToFree: ProfessionalAvailability[] = [];

        for (const av of availabilitiesToFree) {
          if (slotsToFree.length > 0) {
            const prevSlot = slotsToFree[slotsToFree.length - 1].slot;
            if (prevSlot.endTime !== av.slot.startTime) break;
          }

          const minutes = this.calculateSlotDuration(av.slot);
          totalMinutes += minutes;
          slotsToFree.push(av);

          if (totalMinutes >= appointment.duration_minutes_appointments) break;
        }

        for (const av of slotsToFree) {
          av.status = 'libre';
          await manager.save(av);
        }
      }
      return updatedAppointment;
    });
  }
}
