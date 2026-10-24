import { z } from 'zod';

export const PropertySchema = z.object({
  apn: z.string().min(1, "APN is required"),
  estimatedMarketValue: z.number().positive().optional(),
  lifecycleStage: z.enum(['PROSPECT', 'DUE_DILIGENCE', 'ACQUIRED', 'SOLD']).optional(),
});
