import { NextRequest, NextResponse } from 'next/server';

import { aiOrchestrator } from '@/services/ai/orchestrator';
import { checkIpLimit, incrementIpCount } from '@/services/security/rate-limiter';
import { auth } from '@/auth';

const USAGE_LIMIT = 3;
const COOKIE_NAME = 'decido_usage';

function getTodayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return '127.0.0.1';
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const isPro = session?.user?.plan === 'pro';

    const { input, history } = await req.json();
    const isProd = process.env.NODE_ENV === 'production';

    if (!input || typeof input !== 'string' || input.trim() === '') {
      return NextResponse.json(
        { error: 'Input is required and must be a string.' },
        { status: 400 }
      );
    }

    // 1. Verificação por Cookie (Soft Limit - Todos os ambientes)
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

    if (!isPro && usage.count >= USAGE_LIMIT) {
      return NextResponse.json(
        { error: 'Limite diário de análises atingido. Tente novamente amanhã.' },
        { status: 429 }
      );
    }

    // 2. Verificação por IP (Hard Limit - Apenas Produção)
    const ip = getClientIp(req);
    if (!isPro && isProd) {
      const { allowed } = checkIpLimit(ip);
      if (!allowed) {
        return NextResponse.json(
          { error: 'Limite de segurança por dispositivo atingido. Tente novamente amanhã.' },
          { status: 429 }
        );
      }
    }

    // Processar análise
    const result = await aiOrchestrator(input, history);

    // Atualizar contadores (apenas para não-PRO)
    const response = NextResponse.json(result);
    if (!isPro) {
      usage.count += 1;
      if (isProd) incrementIpCount(ip);
      response.cookies.set(COOKIE_NAME, JSON.stringify(usage), {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24,
      });
    }

    return response;
  } catch (error: unknown) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Não foi possível processar a análise no momento.' },
      { status: 500 }
    );
  }
}
