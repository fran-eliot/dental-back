import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AvailabiltiesModule } from './availabilities/availabities.module';
import { ProfessionalAvailability } from './availabilities/entities/ProfessionalAvailability';
import { Slot } from './availabilities/entities/Slot';
import { Professional } from './professional/entities/profesional.entity';
import { ProfessionalsModule } from './professional/professionals.module';
import { TreatmentsModule } from './treatments/treatments.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { Treatment } from './treatments/entities/Treatment';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // lo hace accesible en todos los módulos sin volver a importarlo, para las variables de entorno
    }),
    TreatmentsModule,
    ProfessionalsModule,
    AuthModule,
    UsersModule,
    AvailabiltiesModule,
    TypeOrmModule.forRoot({
      type: 'mysql', // Tipo de base de datos
      host: 'localhost', // Cambia si usas otro host
      port: 3306,
      username: 'nestuser', // Usuario MySQL con permisos
      password: 'nestpass',
      database: 'clinica_dental',
      entities: [User, Professional, Slot, ProfessionalAvailability, Treatment],
      synchronize: false, // ¡Ojo! En producción suele estar en false, para que no cambie el esquema automáticamente
      logging: true,
    }),
  ],
  //controllers: [AppController],
  //providers: [AppService],
})
export class AppModule {}
