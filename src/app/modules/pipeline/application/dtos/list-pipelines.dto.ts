import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const listPipelinesSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().min(1).optional(),
  includeOperators: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
});

export class ListPipelinesDto extends createZodDto(listPipelinesSchema) {}
