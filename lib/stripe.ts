import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  // We'll throw only in production, or log a warning in dev
  if (process.env.NODE_ENV === 'production') {
    throw new Error('STRIPE_SECRET_KEY is missing');
  } else {
    console.warn('⚠️ STRIPE_SECRET_KEY is missing in environment variables');
  }
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27.acacia' as any, // Using latest stable or acacia
  typescript: true,
});

export const PRO_PLAN_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID || 'price_1Qx...'; // Placeholder
