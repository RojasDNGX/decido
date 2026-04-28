import { NextRequest, NextResponse } from 'next/server';

import { aiOrchestrator } from '@/services/ai/orchestrator';

const USAGE_LIMIT = 5;
const COOKIE_NAME = 'decido_usage';

function getTodayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();

    if (!input || typeof input !== 'string' || input.trim() === '') {
      return NextResponse.json(
        { error: 'Input is required and must be a string.' },
        { status: 400 }
      );
    }

    const today = getTodayDate();
    const raw = req.cookies.get(COOKIE_NAME)?.value;
    let usage = { count: 0, date: today };

    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        usage = parsed.date === today
          ? { count: parsed.count, date: today }
          : { count: 0, date: today };
      } catch {
        usage = { count: 0, date: today };
      }
    }

    if (usage.count >= USAGE_LIMIT) {
      return NextResponse.json(
        { error: 'Limite diário de análises atingido. Tente novamente amanhã.' },
        { status: 429 }
      );
    }

    usage.count += 1;

    const result = await aiOrchestrator(input);

    const response = NextResponse.json(result);
    response.cookies.set(COOKIE_NAME, JSON.stringify(usage), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: error.message || 'Não foi possível processar a análise no momento.' },
      { status: 500 }
    );
  }
}
