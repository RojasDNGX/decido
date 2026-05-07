import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/usage-db';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { plan } = await req.json();
  if (plan !== 'pro' && plan !== 'free') {
    return NextResponse.json({ error: 'Plano inválido' }, { status: 400 });
  }

  try {
    // Update plan in DB
    db.prepare('UPDATE users SET plan = ? WHERE email = ?').run(plan, session.user.email);
    return NextResponse.json({ success: true, plan });
  } catch (error) {
    console.error('Failed to update plan:', error);
    return NextResponse.json({ error: 'Erro ao atualizar plano' }, { status: 500 });
  }
}
