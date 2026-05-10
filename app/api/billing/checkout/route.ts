import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { stripe } from '@/lib/stripe';
import { getUserByEmail, updateUserStripeInfo } from '@/lib/users-db';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      console.warn('[Stripe Checkout] Tentativa de acesso sem autenticação.');
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    console.log(`[Stripe Checkout] Iniciando para usuário: ${session.user.email}`);
    const user = getUserByEmail(session.user.email);
    if (!user) {
      console.error(`[Stripe Checkout] Usuário não encontrado: ${session.user.email}`);
      return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });
    }

    // 1. Ensure Stripe Customer exists
    let customerId = (user as any).stripe_customer_id;
    console.log(`[Stripe Checkout] Customer ID atual: ${customerId}`);
    
    if (!customerId) {
      console.log(`[Stripe Checkout] Criando novo cliente na Stripe...`);
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: {
          userId: user.id,
        },
      });
      customerId = customer.id;
      console.log(`[Stripe Checkout] Novo Customer ID criado: ${customerId}`);
      // Save customer ID to database
      updateUserStripeInfo(user.id, { stripe_customer_id: customerId });
    }

    // 2. Create Checkout Session
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';
    const priceId = process.env.STRIPE_PRO_PRICE_ID;
    
    if (!priceId || priceId === 'price_placeholder') {
      console.error(`[Stripe Checkout] STRIPE_PRO_PRICE_ID não configurado ou inválido: ${priceId}`);
      return NextResponse.json({ error: 'Configuração de preço ausente no servidor.' }, { status: 500 });
    }

    console.log(`[Stripe Checkout] Criando sessão para o preço: ${priceId}`);
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId, 
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${baseUrl}/minha-conta?success=payment`,
      cancel_url: `${baseUrl}/limite?canceled=true`,
      metadata: {
        userId: user.id,
      },
    });

    console.log(`[Stripe Checkout] Sessão criada com sucesso: ${checkoutSession.url}`);
    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error('[Stripe Checkout Error Fatal]:', error);
    return NextResponse.json({ 
      error: error.message || 'Erro interno ao processar checkout.',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    }, { status: 500 });
  }
}
