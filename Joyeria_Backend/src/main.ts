import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

{/*
  async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
   */}


// src/main.ts 
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // -----------------------------------------------------------------
  // 💡 HABILITAR CORS AQUÍ
  app.enableCors({
    // Permite cualquier origen (para desarrollo)
    origin: true, 
    // O puedes especificar el puerto de tu frontend, ej: 'http://localhost:3001'
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  // -----------------------------------------------------------------

  await app.listen(3000);
}
bootstrap();