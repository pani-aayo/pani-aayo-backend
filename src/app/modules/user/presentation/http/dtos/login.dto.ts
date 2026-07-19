import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
  deviceId: z.string().min(1).optional(),
});

export class LoginDto extends createZodDto(loginSchema) {}
