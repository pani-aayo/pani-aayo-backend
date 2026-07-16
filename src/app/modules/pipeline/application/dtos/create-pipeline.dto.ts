import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { PipelineStatus } from '../../../../../generated/prisma/enums';

export const createPipelineSchema = z.object({
  name: z.string().min(1),
  areaServed: z.string().min(1),
  flowRate: z.number().positive().optional(),
  description: z.string().min(1).optional(),
  status: z.enum(PipelineStatus).default(PipelineStatus.CLOSED),
});

export class CreatePipelineDto extends createZodDto(createPipelineSchema) {}
