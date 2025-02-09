import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const PORT = process.env.PORT ?? 3000;
async function bootstrap() {
  await beforeBootstrap();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('/api');

  await app.listen(PORT);
  Logger.log(`Server is running on port ${PORT}`);
}

async function beforeBootstrap() {
  if (!('DEFAULT_ROLE_KEY' in process.env)) {
    throw new Error('DefaultRoleKey is not set in .env file');
  }

  const prisma = new PrismaClient();
  await prisma.$connect();

  const defaultRoleExists = await prisma.role.findFirst({
    where: {
      key: process.env.DEFAULT_ROLE_KEY,
    },
    select: {
      id: true,
    },
  });

  if (!defaultRoleExists) {
    throw new Error('Default role does not exist');
  }

  await prisma.$disconnect();
}

bootstrap();
