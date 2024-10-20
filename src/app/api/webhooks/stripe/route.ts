import { db } from '@/db'
import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'
import type Stripe from 'stripe'
import { PLANS, ONE_TIME_PURCHASES } from '@/config/stripe'
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
    return new Response(null, {
      status: 200,
    })
  }

  try {
    posthog = PostHogClient()

    if (event.type === 'checkout.session.completed') {
      console.log("Checkout session completed");
      const isSubscription = session.metadata.isSubscription === 'true'
      
      if (isSubscription) {
        console.log("Processing subscription");
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        )

        const priceId = subscription.items.data[0]?.price.id
        const plan = PLANS.find(plan => plan.price.priceIds.test === priceId)
        const planName = plan?.name || 'Free'
        const tokens = plan?.tokens || 0

        await db.user.update({
          where: {
            id: session.metadata.userId,
          },
          data: {
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer as string,
            stripePriceId: priceId,
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
            plan: planName,
            tokens: tokens,
          },
        })

        // Capture PostHog event for subscription created
        posthog.capture({
          distinctId: session.metadata.userId,
          event: 'subscription_created',
          properties: {
            plan: planName,
            tokens: tokens,
            amount: subscription.items.data[0]?.price.unit_amount,
            currency: subscription.currency,
          },
        })
      } else {
        console.log("Processing one-time purchase");
        // Handle one-time purchase
        const priceId = session.line_items?.data[0]?.price?.id
        const purchase = ONE_TIME_PURCHASES.find(p => p.price.priceIds.test === priceId)
        const tokens = purchase?.tokens || 0


        
        const user = await db.user.findUnique({
          where: { id: session.metadata.userId },
          select: { tokens: true }
        })
        console.log("Tokens before update:", user?.tokens);
        console.log("Tokens to add:", tokens);
        
        const updatedUser = await db.user.update({
          where: {
            id: session.metadata.userId,
          },
          data: {
            tokens: (user?.tokens || 0) + tokens,
          },
        })

        console.log("Tokens after update:", updatedUser.tokens);

        // Capture PostHog event for one-time purchase
        posthog.capture({
          distinctId: session.metadata.userId,
          event: 'one_time_purchase',
          properties: {
            tokens: tokens,
            amount: session.amount_total,
            currency: session.currency,
          },
        })
      }
    }

  if (event.type === 'invoice.payment_succeeded') {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    const priceId = subscription.items.data[0]?.price.id
    const plan = PLANS.find(plan => plan.price.priceIds.test === priceId)
    const planName = plan?.name || 'Free'
    const tokens = plan?.tokens || 0

    await db.user.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        stripePriceId: priceId,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
        plan: planName,
        tokens: tokens,
      },
    })


     // Capture PostHog event for subscription renewed
     posthog.capture({
      distinctId: session.metadata.userId,
      event: 'subscription_renewed',
      properties: {
        plan: planName,
        tokens: tokens,
        amount: subscription.items.data[0]?.price.unit_amount,
        currency: subscription.currency,
      },
    })
  }

} catch (error) {
  console.error('Error with PostHog:', error)
} finally {
  if (posthog) {
    await posthog.shutdown()
  }
}

  return new Response(null, { status: 200 })
}