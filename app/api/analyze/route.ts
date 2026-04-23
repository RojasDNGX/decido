import { NextRequest, NextResponse } from 'next/server';

import { aiOrchestrator } from '@/services/aiOrchestrator';

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();

    if (!input || typeof input !== 'string' || input.trim() === '') {
      return NextResponse.json(
        { error: 'Input is required and must be a string.' },
        { status: 400 }
      );
    }

    const result = await aiOrchestrator(input);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: error.message || 'Não foi possível processar a análise no momento.' },
      { status: 500 }
    );
  }
}
