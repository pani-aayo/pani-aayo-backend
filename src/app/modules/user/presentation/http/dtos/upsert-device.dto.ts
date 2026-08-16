import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const upsertDeviceSchema = z.object({
  deviceId: z.string().min(1),
});

export class UpsertDeviceDto extends createZodDto(upsertDeviceSchema) {}
