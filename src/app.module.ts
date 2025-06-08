import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ProfessionalsModule } from './professional/professionals.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { Professional } from './professional/entities/profesional.entity';
import { Slot } from './availabilities/entities/Slot';
import { ProfessionalAvailability } from './availabilities/entities/ProfessionalAvailability';
import { AvailabiltiesModule } from './availabilities/availabities.module';

@Module({
  imports: [ProfessionalsModule, AuthModule,
    UsersModule, AvailabiltiesModule,
    TypeOrmModule.forRoot({
      type: 'mysql', // Tipo de base de datos
      host: 'localhost', // Cambia si usas otro host
      port: 3306, 
      username: 'nestuser', // Usuario MySQL con permisos
      password: 'nestpass',
      database: 'clinica_dental', 
      entities: [User, Professional,Slot,ProfessionalAvailability], 
      synchronize: false, // ¡Ojo! En producción suele estar en false, para que no cambie el esquema automáticamente
      logging:true,
    }),
    ConfigModule.forRoot({
      isGlobal: true, // lo hace accesible en todos los módulos sin volver a importarlo
    }),
    //AuthModule,
    //UsersModule,
  ],
  //controllers: [AppController],
  //providers: [AppService],
})
export class AppModule {}
