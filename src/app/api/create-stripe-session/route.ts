import { NextResponse } from 'next/server'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { stripe, getUserSubscriptionPlan } from '@/lib/stripe'
import { db } from '@/db'
import { PLANS } from '@/config/stripe'
import { absoluteUrl } from '@/lib/utils'

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

    const { planName } = await request.json()
    const selectedPlan = PLANS.find(plan => plan.name === planName)

    if (!selectedPlan) {
      return NextResponse.json({ message: 'Invalid plan selected' }, { status: 400 })
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: billingUrl,
      cancel_url: billingUrl,
      payment_method_types: ['card'],
      mode: 'subscription',
      billing_address_collection: 'auto',
      line_items: [{
        price: selectedPlan.price.priceIds.test,
        quantity: 1,
      }],
      metadata: {
        userId: user.id,
      },
    })

    return NextResponse.json({ url: stripeSession.url })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
}