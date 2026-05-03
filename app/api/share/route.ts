import { NextRequest, NextResponse } from 'next/server';
import { saveShare } from '@/lib/share-db';
import { AnalysisResult } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const output: AnalysisResult = await req.json();
    if (!output?.primary_action && !output?.recommended_action) {
      return NextResponse.json({ error: 'Invalid decision object.' }, { status: 400 });
    }
    const id = saveShare(output);
    return NextResponse.json({ share_url: `/d/${id}` });
  } catch {
    return NextResponse.json({ error: 'Failed to create share.' }, { status: 500 });
  }
}
