import { getUserSubscriptionPlan } from '@/lib/stripe'
import TokenDisplayClient from './TokenDisplayClient'

const TokenDisplayServer = async () => {
  const subscriptionPlan = await getUserSubscriptionPlan()
  const initialTokens = subscriptionPlan.tokens || 0
  const plan = subscriptionPlan.plan || 'Free'

  return <TokenDisplayClient initialTokens={initialTokens} initialPlan={plan} />
}

export default TokenDisplayServer