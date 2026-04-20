import { NextRequest, NextResponse } from 'next/server';
import { analyzeTasks } from '@/services/ai';

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();

    if (!input || typeof input !== 'string' || input.trim() === '') {
      return NextResponse.json(
        { error: 'Input is required and must be a string.' },
        { status: 400 }
      );
    }

    const result = await analyzeTasks(input);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during analysis.' },
      { status: 500 }
    );
  }
}
