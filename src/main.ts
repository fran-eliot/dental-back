import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  
  //Configuracion swagger
  const config = new DocumentBuilder() 
    .setTitle('API Clinica Dental') 
    .setDescription('Documentación de la API de la clinica dental') 
    .setVersion('1.0') 
    .addTag('dental') 
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
        description: 'Ingrese el token JWT',
      },
      'access-token', // Este nombre se usará en los decoradores @ApiBearerAuth()
    )
    .build(); 
 
const document = SwaggerModule.createDocument(app, config); 
SwaggerModule.setup('api', app, document, {
  swaggerOptions: {
    persistAuthorization: true,
    security: [{ 'access-token': [] }],
  },
});
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
