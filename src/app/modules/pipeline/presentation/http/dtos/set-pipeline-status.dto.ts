import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { PipelineStatus } from '../../../../../../generated/prisma/enums';

export const setPipelineStatusSchema = z.object({
  status: z.enum([PipelineStatus.OPEN, PipelineStatus.CLOSED]),
});

export class SetPipelineStatusDto extends createZodDto(setPipelineStatusSchema) {}
