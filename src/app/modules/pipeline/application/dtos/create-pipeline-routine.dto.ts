import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const timeSlotSchema = z.object({
  startHour: z.string().min(1),
  endHour: z.string().min(1),
});

const daySchema = z.array(timeSlotSchema).default([]);

export const createPipelineRoutineSchema = z.object({
  routineSummary: z.string().nullable(),
  routine: z.object({
    mon: daySchema,
    tue: daySchema,
    wed: daySchema,
    thu: daySchema,
    fri: daySchema,
    sat: daySchema,
    sun: daySchema,
  }),
});

export class CreatePipelineRoutineDto extends createZodDto(createPipelineRoutineSchema) {}
