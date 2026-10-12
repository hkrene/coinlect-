import { NextRequest, NextResponse } from 'next/server';
import { getGeminiResponse } from '@/services/geminiService';
import { chatSchema } from '@/lib/validators';
import { enforceRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  // The AI backend costs money per call; throttle abuse per IP.
  const limited = enforceRateLimit(request, 'chat', 20, 60 * 1000);
  if (limited) return limited;

  try {
    const body = await request.json().catch(() => ({}));
    const parsed = chatSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { message, language } = parsed.data;

    const response = await getGeminiResponse(message, language);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
