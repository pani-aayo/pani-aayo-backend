import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createOperatorSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

export class CreateOperatorDto extends createZodDto(createOperatorSchema) {}
