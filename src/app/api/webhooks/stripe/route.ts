import { db } from '@/db'
import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'
import type Stripe from 'stripe'
import { PLANS } from '@/config/stripe'
import PostHogClient from '../../../../lib/posthog'
import { PostHog } from 'posthog-node'

export async function POST(request: Request) {
  console.log("Webhook received");
  const body = await request.text()
  const signature = headers().get('Stripe-Signature') ?? ''

  let event: Stripe.Event
  let posthog: PostHog | null = null;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    )
    console.log("Event constructed successfully:", event.type);
  } catch (err) {
    console.error("Error constructing event:", err);
    return new Response(
      `Webhook Error: ${
        err instanceof Error ? err.message : 'Unknown Error'
      }`,
      { status: 400 }
    )
  }

  const session = event.data.object as Stripe.Checkout.Session

  if (!session?.metadata?.userId) {
    console.log("No userId in session metadata, skipping processing");
    return new Response(null, { status: 200 })
  }

  try {
    posthog = PostHogClient()

    if (event.type === 'checkout.session.completed') {
      console.log("Checkout session completed");
      const isSubscription = session.metadata?.isSubscription === 'true';
      
      if (isSubscription) {
        console.log("Processing subscription");
        await handleSubscription(session);
      } else {
        console.log("Processing one-time purchase");
        await handleOneTimePurchase(session);
      }
    }

    if (event.type === 'invoice.payment_succeeded') {
      console.log("Invoice payment succeeded");
      await handleInvoicePayment(session);
    }

  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(`Webhook Error: ${error instanceof Error ? error.message : 'Unknown Error'}`, { status: 400 })
  } finally {
    if (posthog) {
      await posthog.shutdown()
    }
  }

  return new Response(null, { status: 200 })
}

async function handleSubscription(session: Stripe.Checkout.Session) {
  const subscriptionId = session.subscription as string;
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const priceId = subscription.items.data[0]?.price.id;
  const plan = PLANS.find(plan => plan.price.priceIds.test === priceId);
  const planName = plan?.name || 'Free';
  const tokens = plan?.tokens || 0;

  await db.user.update({
    where: { id: session.metadata?.userId },
    data: {
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      stripePriceId: priceId,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      plan: planName,
      tokens: tokens,
    },
  });

  PostHogClient().capture({
    distinctId: session.metadata?.userId || '',
    event: 'subscription_created',
    properties: {
      plan: planName,
      tokens: tokens,
      amount: subscription.items.data[0]?.price.unit_amount,
      currency: subscription.currency,
    },
  });
}

async function handleOneTimePurchase(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const planName = session.metadata?.planName || '';
  const tokens = parseInt(planName.split('-')[0] || '0', 10);

  if (userId) {
    const user = await db.user.findUnique({ where: { id: userId } });
    
    if (user) {
      await db.user.update({
        where: { id: userId },
        data: {
          tokens: (user.tokens || 0) + tokens,
          stripeCustomerId: session.customer as string,
        },
      });
      console.log(`Updated user ${userId} with ${tokens} tokens`);
    } else {
      console.error(`User not found: ${userId}`);
    }
  }

  PostHogClient().capture({
    distinctId: userId || '',
    event: 'one_time_purchase',
    properties: {
      tokens: tokens,
      amount: session.amount_total,
      currency: session.currency,
    },
  });
}

async function handleInvoicePayment(session: Stripe.Checkout.Session) {
  const subscriptionId = session.subscription as string;
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const priceId = subscription.items.data[0]?.price.id;
  const plan = PLANS.find(plan => plan.price.priceIds.test === priceId);
  const planName = plan?.name || 'Free';
  const tokens = plan?.tokens || 0;

  await db.user.update({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      stripePriceId: priceId,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      plan: planName,
      tokens: tokens,
    },
  });

  PostHogClient().capture({
    distinctId: session.metadata?.userId || '',
    event: 'subscription_renewed',
    properties: {
      plan: planName,
      tokens: tokens,
      amount: subscription.items.data[0]?.price.unit_amount,
      currency: subscription.currency,
    },
  });
}