import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Professional } from 'src/professional/entities/profesional.entity';
import * as dayjs from 'dayjs';
import { Slot } from './entities/Slot';
import { ProfessionalAvailability } from './entities/ProfessionalAvailability';
import { Status } from './enums/status.enum';

/**
 * Servicio para gestionar la lógica de negocio relacionada con
 * la disponibilidad de los profesionales de la clínica.
 */
@Injectable()
export class AvailabilitiesService {
  constructor(
    @InjectRepository(Slot)
    private slotRepo: Repository<Slot>,

    @InjectRepository(ProfessionalAvailability)
    private availabilityRepo: Repository<ProfessionalAvailability>,

    @InjectRepository(Professional)
    private professionalRepo: Repository<Professional>,
  ) {}

  /**
   * Genera las disponibilidades para todos los profesionales activos
   * durante los días laborables (lunes a viernes) de la semana actual.
   * Cada disponibilidad se genera combinando todos los slots existentes
   * con cada profesional para cada día.
   */
  async generateAvailabilitiesForNextWeek(): Promise<void> {
    const professionalIds: number[] = (
      await this.professionalRepo.find({
        where: { is_active_professionals: true },
        select: ['id_professionals']
      })
    ).map(p => p.id_professionals);

    console.log(professionalIds) ;
     // const professionalIds = [7, 8, 9, 10];

    const dayjs = require('dayjs');

    const startDate = dayjs().startOf('week').add(1, 'day'); // Lunes
    const endDate = startDate.add(5, 'day'); // Viernes

    const professionals = await this.professionalRepo.findByIds(professionalIds);
    const slots = await this.slotRepo.find(); // Ya deberían estar creados

    const availabilities: ProfessionalAvailability[] = [];

    for (let date = startDate; date.isBefore(endDate); date = date.add(1, 'day')) {
      for (const professional of professionals) {
        for (const slot of slots) {
          const availability = this.availabilityRepo.create({
            date: date.toDate(),
            status: 'libre',
            professional,
            slot,
          });

          availabilities.push(availability);
        }
      }
    }

    await this.availabilityRepo.save(availabilities);
  }


  /**
   * Devuelve todas las disponibilidades de un profesional en una fecha concreta.
   * Incluye los slots asociados para mostrar información completa.
   *
   * @param professionalId ID del profesional
   * @param date Fecha a consultar
   */
  async getAvailabilityByProfessional(professionalId: number, date: Date): Promise<ProfessionalAvailability[]> {
    const dayjs = require('dayjs');
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    return await this.availabilityRepo
      .createQueryBuilder('availability')
      .leftJoinAndSelect('availability.slot', 'slot') 
      .where('availability.professional = :professionalId', { professionalId })
      .andWhere('DATE(availability.date) = :date', { date:formattedDate })
      .getMany();
  }

  /**
   * Cambia el estado de una disponibilidad concreta.
   * Lanza error si no se encuentra la disponibilidad.
   *
   * @param id ID de la disponibilidad
   * @param status Nuevo estado ('libre', 'reservado', 'no disponible')
   */
  async updateAvailabilityStatus(id: number, status: Status): Promise<ProfessionalAvailability>{
    const availability = await this.availabilityRepo.findOne({ where: { id } });

    if (!availability) {
      throw new Error(`No se encontró disponibilidad con ID ${id}`);
    }

    availability.status = status;
    return await this.availabilityRepo.save(availability);
  }

  /**
   * Devuelve todos los slots que están libres para un profesional
   * en una fecha determinada.
   *
   * @param professionalId ID del profesional
   * @param date Fecha a consultar
   */
  async getFreeSlotsByDate(professionalId: number, date: Date): Promise<Slot[]> {
    const dayjs = require('dayjs');
    const dateString = dayjs(date).format('YYYY-MM-DD');
    const availabilities = await this.availabilityRepo
      .createQueryBuilder('availability')
      .leftJoinAndSelect('availability.slot', 'slot')
      .where('availability.professional_id = :professionalId', { professionalId })
      .andWhere('availability.date = :date', { date:dateString })
      .andWhere('availability.status = :status', { status: 'libre' })
      .getMany();

    return availabilities.map(av => av.slot);
  }

  /**
   * Elimina todas las disponibilidades que estén fechadas
   * antes de la fecha indicada.
   *
   * @param beforeDate Fecha límite: se borran las disponibilidades anteriores
   */
  async cleanOldAvailabilities(beforeDate: Date): Promise<void> {
    await this.availabilityRepo
      .createQueryBuilder()
      .delete()
      .from(ProfessionalAvailability)
      .where('date < :beforeDate', { beforeDate })
      .execute();
  }


}
