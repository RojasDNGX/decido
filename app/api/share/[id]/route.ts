import { NextRequest, NextResponse } from 'next/server';
import { getShare } from '@/lib/share-db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const share = getShare(id);
  if (!share) {
    return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  }
  return NextResponse.json(share.output);
}
