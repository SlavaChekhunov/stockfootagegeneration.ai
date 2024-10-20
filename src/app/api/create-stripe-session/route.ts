import { NextResponse } from 'next/server'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { stripe, getUserSubscriptionPlan } from '@/lib/stripe'
import { db } from '@/db'
import { PLANS, ONE_TIME_PURCHASES } from '@/config/stripe'
import { absoluteUrl } from '@/lib/utils'
import PostHogClient from '@/lib/posthog'

export async function POST(request: Request) {
  try {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user || !user.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const dbUser = await db.user.findFirst({
      where: { id: user.id },
    })

    if (!dbUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const subscriptionPlan = await getUserSubscriptionPlan()
    const billingUrl = absoluteUrl('/dashboard')

    if (subscriptionPlan.isSubscribed && dbUser.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: dbUser.stripeCustomerId,
        return_url: billingUrl,
      })

      return NextResponse.json({ url: stripeSession.url })
    }

    const { planName, isSubscription } = await request.json()
    let selectedPlan

    if (isSubscription) {
      selectedPlan = PLANS.find(plan => plan.name === planName)
    } else {
      selectedPlan = ONE_TIME_PURCHASES.find(plan => plan.slug === planName)
    }

    if (!selectedPlan) {
      return NextResponse.json({ message: 'Invalid plan selected' }, { status: 400 })
    }

    console.log("Creating Stripe session for:", {
      planName,
      isSubscription,
      userId: user.id,
    });

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: absoluteUrl('/dashboard'),
      cancel_url: absoluteUrl('/pricing'),
      payment_method_types: ['card'],
      mode: isSubscription ? 'subscription' : 'payment',
      billing_address_collection: 'auto',
      customer_creation: 'always',
      line_items: [{
        price: selectedPlan.price.priceIds.test,
        quantity: 1,
      }],
      metadata: {
        userId: user.id,
        planName: planName,
        isSubscription: isSubscription.toString(),
      },
    })

    console.log("Stripe session created:", stripeSession.id);

    try {
      const posthog = PostHogClient()
      posthog.capture({
        distinctId: user.id,
        event: 'initiate_checkout',
        properties: {
          plan: planName,
          amount: selectedPlan.price.amount,
          currency: 'USD',
          isSubscription: isSubscription,
        },
      })
      await posthog.shutdown()
    } catch (error) {
      console.error('Error capturing PostHog event:', error)
    }

    return NextResponse.json({ url: stripeSession.url })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
}