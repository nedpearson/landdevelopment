'use server';

import { z } from 'zod';

const GenericFormSchema = z.object({
  moduleName: z.string().optional(),
  action: z.string().optional(),
}).passthrough();

export async function submitGenericForm(data: any) {
  try {
    let parsedData = data;
    
    if (data instanceof FormData) {
      parsedData = Object.fromEntries(data.entries());
    }

    const parsed = GenericFormSchema.safeParse(parsedData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    // Simulate DB delay
    await new Promise(res => setTimeout(res, 500));
    return { success: true, data: parsedData };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
