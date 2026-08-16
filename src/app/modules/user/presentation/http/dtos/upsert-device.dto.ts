import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const upsertDeviceSchema = z.object({
  deviceId: z.string().min(1),
  voipToken: z.string().min(1).optional(),
});

export class UpsertDeviceDto extends createZodDto(upsertDeviceSchema) {}
