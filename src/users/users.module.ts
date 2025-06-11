import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UsersController } from '../users/users.controller';
import { UsersService } from './users.service';
import { Professional } from 'src/professional/entities/profesional.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Professional])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
