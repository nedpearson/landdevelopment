'use server';

export async function submitGenericForm(data: any) {
  try {
    // Simulate DB delay
    await new Promise(res => setTimeout(res, 500));
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

