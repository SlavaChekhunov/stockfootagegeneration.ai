import { db } from '@/db'
import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'
import type Stripe from 'stripe'
import { PLANS } from '@/config/stripe'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get('Stripe-Signature') ?? ''

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    )
  } catch (err) {
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

  if (event.type === 'checkout.session.completed') {
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
  }

  return new Response(null, { status: 200 })
}