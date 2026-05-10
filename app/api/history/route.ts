import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUserDecisions, deleteUserHistory } from '@/lib/history-db';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const history = getUserDecisions(session.user.email);
    return NextResponse.json(history);
  } catch (error) {
    console.error('[API History GET Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    deleteUserHistory(session.user.email);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API History DELETE Error]:', error);
    return NextResponse.json({ error: 'Failed to delete history' }, { status: 500 });
  }
}
