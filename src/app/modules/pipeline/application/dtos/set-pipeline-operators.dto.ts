import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const setPipelineOperatorsSchema = z.object({
  operatorCodes: z.array(z.string().min(1)).min(1),
});

export class SetPipelineOperatorsDto extends createZodDto(setPipelineOperatorsSchema) {}
