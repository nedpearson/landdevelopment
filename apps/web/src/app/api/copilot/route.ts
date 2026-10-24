import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy',
});

const SYSTEM_PROMPT = `You are the Land Intelligence OS Copilot. 
You assist users with land acquisition, development, and market analysis.
Keep your answers concise, professional, and tailored to the commercial real estate domain.`;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // or gpt-4-turbo
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return NextResponse.json({ 
      message: response.choices[0]?.message?.content || 'No response generated.' 
    });

  } catch (error: any) {
    console.error('Copilot API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
