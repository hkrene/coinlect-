import { NextRequest, NextResponse } from 'next/server';
import { getGeminiResponse } from '@/services/geminiService';

export async function POST(request: NextRequest) {
  try {
    const { message, language } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Debug: Check if API key is available
    const apiKeyAvailable = !!process.env.GEMINI_API_KEY;
    console.log('API Key available:', apiKeyAvailable);
    console.log('API Key length:', process.env.GEMINI_API_KEY?.length || 0);
    console.log('User language:', language);

    const response = await getGeminiResponse(message, language);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process message', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

