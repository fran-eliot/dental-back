import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Slot } from '../entities/Slot';
import { Repository } from 'typeorm';
import { ProfessionalAvailability } from '../entities/ProfessionalAvailability';
import { Professional } from 'src/professional/entities/profesional.entity';
import dayjs from 'dayjs';

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

    async generateAvailabilitiesForNextWeek(): Promise<void> {
      const professionalIds: number[] = (
        await this.professionalRepo.find({
          where: { is_active_professionals: true },
          select: ['id_professionals']
        })
      ).map(p => p.id_professionals);

     
      // const professionalIds = [7, 8, 9, 10];

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
}
