import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getUserByEmail, updateUserStripeInfo, logBillingEvent, getUserByStripeSubscriptionId } from '@/lib/users-db';
import Stripe from 'stripe';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: any) { // Usando any para evitar conflitos de NextRequest/Stripe raw body
  const payload = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event: Stripe.Event;

  try {
    if (!sig || !endpointSecret) {
      throw new Error('Missing stripe-signature or webhook secret');
    }
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err: any) {
    console.error(`❌ Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Idempotency check & Logging
  const isNewEvent = logBillingEvent(null, event.id, event.type, payload);
  if (!isNewEvent) {
    console.log(`ℹ️ Webhook event ${event.id} already processed. Skipping.`);
    return NextResponse.json({ received: true, duplication: true });
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;
        const userId = session.metadata?.userId;

        if (userId) {
          // Get subscription details to find the price ID and period end
          const subscription = await stripe.subscriptions.retrieve(subscriptionId) as Stripe.Subscription;
          
          updateUserStripeInfo(Number(userId), {
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            stripe_subscription_status: subscription.status,
            stripe_price_id: (subscription as any).items.data[0].price.id,
            stripe_current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            stripe_cancel_at_period_end: subscription.cancel_at_period_end,
            plan: 'pro'
          });
          console.log(`✅ User ${userId} upgraded to PRO via Checkout`);
        }
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as any; // Cast para any para acessar subscription
        const subscriptionId = invoice.subscription as string;
        
        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId) as Stripe.Subscription;
          const user = getUserByStripeSubscriptionId(subscriptionId);
          
          if (user) {
            updateUserStripeInfo(user.id, {
              stripe_current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              stripe_subscription_status: subscription.status,
              stripe_cancel_at_period_end: subscription.cancel_at_period_end,
              plan: 'pro'
            });
            console.log(`🔄 Subscription renewed for user ${user.id}`);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const user = getUserByStripeSubscriptionId(subscription.id);
        
        if (user) {
          updateUserStripeInfo(user.id, {
            plan: 'free',
            stripe_subscription_id: '',
            stripe_price_id: '',
            stripe_subscription_status: subscription.status
          });
          console.log(`🚫 Subscription canceled and user ${user.id} downgraded to FREE`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error('[Webhook Processing Error]:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

export const config = {
  api: {
    bodyParser: false, // Disabling default body parser to get raw body for signature
  },
};
