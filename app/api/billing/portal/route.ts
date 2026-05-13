import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { stripe } from '@/lib/stripe';
import { getUserByEmail } from '@/lib/users-db';

export async function POST(_req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    const user = getUserByEmail(session.user.email);
    if (!user || !user.stripe_customer_id) {
      return NextResponse.json({ error: 'Nenhuma assinatura ativa encontrada.' }, { status: 404 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${baseUrl}/minha-conta`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error: unknown) {
    console.error('[Stripe Portal Error]:', error);
    return NextResponse.json({ error: 'Erro ao abrir o portal de faturamento.' }, { status: 500 });
  }
}
