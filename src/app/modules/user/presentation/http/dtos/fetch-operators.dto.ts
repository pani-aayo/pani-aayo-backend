import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const FetchOperatorsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().min(1).optional(),
});

export class FetchOperatorsDto extends createZodDto(FetchOperatorsSchema) {}
