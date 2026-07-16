import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { AuthModule } from './auth/auth.module';
import { validateEnv } from './config/env.schema';
import { PrismaModule } from './prisma/prisma.module';

@Global()
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, cache: true, validate: validateEnv }), PrismaModule, AuthModule],
  providers: [{ provide: APP_PIPE, useClass: ZodValidationPipe }],
  exports: [PrismaModule, AuthModule],
})
export class GlobalModule {}
