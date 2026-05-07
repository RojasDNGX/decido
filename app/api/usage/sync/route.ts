import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDailyUsage } from '@/lib/usage-db';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email;
    const { searchParams } = new URL(req.url);
    const fingerprint = searchParams.get('fingerprint');
    
    const getClientIp = (req: NextRequest): string => {
      const forwarded = req.headers.get('x-forwarded-for');
      if (forwarded) return forwarded.split(',')[0].trim();
      return '127.0.0.1';
    };

    const today = new Date().toISOString().slice(0, 10);
    const identifier = userEmail || fingerprint || getClientIp(req);
    const count = getDailyUsage(identifier, today);

    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
