import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const registerResidentSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

export class RegisterResidentDto extends createZodDto(registerResidentSchema) {}
