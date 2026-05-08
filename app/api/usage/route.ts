import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUserPlan } from '@/lib/users-db';
import { getDailyUsage } from '@/lib/usage-db';
import { getPlanLimits } from '@/lib/plans';

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
    const userEmail = session?.user?.email;
    const userPlan = userEmail ? getUserPlan(userEmail) : 'guest';
    const limits = getPlanLimits(userPlan);
    const isPro = userPlan === 'pro' || userPlan === 'enterprise';

    const { fingerprint } = await req.json().catch(() => ({ fingerprint: null }));

    const ip = getClientIp(req);
    const identifier = userEmail || (fingerprint ? `fp:${fingerprint}` : `ip:${ip}`);
    const today = getTodayDate();

    const count = getDailyUsage(identifier, today);
    const remaining = isPro ? Infinity : Math.max(0, limits.dailyAnalyses - count);

    return NextResponse.json({
      count,
      remaining,
      limit: limits.dailyAnalyses,
      isPro,
      plan: userPlan
    });
  } catch (error) {
    console.error('[API Usage Error]:', error);
    return NextResponse.json({ error: 'Failed to get usage data' }, { status: 500 });
  }
}
