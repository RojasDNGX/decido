import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUserByEmail, updateUserProfile } from '@/lib/users-db';

export async function GET(_req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    const user = getUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });
    }

    return NextResponse.json({
      name: user.name || '',
      email: user.email,
      phone: user.phone || '',
      profession: user.profession || '',
      company: user.company || '',
      id: user.id,
      hasPassword: !!user.password,
      plan: user.plan,
      subscriptionStatus: user.stripe_subscription_status || 'none',
      periodEnd: user.stripe_current_period_end || null,
      cancelAtPeriodEnd: !!user.stripe_cancel_at_period_end
    });
  } catch (error) {
    console.error('[API User Profile GET Error]:', error);
    return NextResponse.json({ error: 'Erro ao carregar perfil.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    const data = await req.json();
    const { name, phone, profession, company } = data;

    const user = getUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });
    }

    updateUserProfile(user.id, {
      name: name || '',
      phone: phone || '',
      profession: profession || '',
      company: company || ''
    });

    return NextResponse.json({ success: true, message: 'Perfil atualizado com sucesso!' });
  } catch (error) {
    console.error('[API User Profile PUT Error]:', error);
    return NextResponse.json({ error: 'Erro ao atualizar perfil.' }, { status: 500 });
  }
}
