import { PLANS, ONE_TIME_PURCHASES } from '@/config/stripe'
import { db } from '@/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2024-06-20',
  typescript: true,
})

export async function getUserSubscriptionPlan() {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

  if (!user?.id) {
    return {
      ...PLANS[0],
      isSubscribed: false,
      isCanceled: false,
      stripeCurrentPeriodEnd: null,
      tokens: 0,
      plan: "You're not on any plan yet",
    }
  }

  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
      plan: true,
      tokens: true,
    },
  })

  if (!dbUser) {
    return {
      ...PLANS[0],
      isSubscribed: false,
      isCanceled: false,
      stripeCurrentPeriodEnd: null,
      tokens: 0,
      plan: "You're not on any plan yet",
    }
  }

  const isSubscribed = Boolean(
    dbUser.stripePriceId &&
      dbUser.stripeCurrentPeriodEnd && // 86400000 = 1 day
      dbUser.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now()
  )

  if (isSubscribed) {
    const plan = PLANS.find((plan) => plan.price.priceIds.test === dbUser.stripePriceId)
    let isCanceled = false
    if (dbUser.stripeSubscriptionId) {
      const stripePlan = await stripe.subscriptions.retrieve(
        dbUser.stripeSubscriptionId
      )
      isCanceled = stripePlan.cancel_at_period_end
    }
    return {
      ...plan,
      stripeSubscriptionId: dbUser.stripeSubscriptionId,
      stripeCurrentPeriodEnd: dbUser.stripeCurrentPeriodEnd,
      stripeCustomerId: dbUser.stripeCustomerId,
      stripePriceId: dbUser.stripePriceId,
      tokens: dbUser.tokens,
      isSubscribed: true,
      isCanceled,
      plan: plan?.name || "You're not on any plan yet",
    }
  }

  // If the user has tokens but no active subscription, they've made a one-time purchase
  if (dbUser.tokens > 0) {
    const purchase = ONE_TIME_PURCHASES.find((p) => p.tokens <= dbUser.tokens)
    return {
      ...purchase,
      tokens: dbUser.tokens,
      isSubscribed: false,
      isCanceled: false,
      stripeCurrentPeriodEnd: null,
      plan: purchase?.name || "One-time purchase",
    }
  }

  // Default to the free plan if no subscription or tokens
  return {
    ...PLANS[0],
    tokens: 0,
    isSubscribed: false,
    isCanceled: false,
    stripeCurrentPeriodEnd: null,
    plan: "You're not on any plan yet",
  }
}