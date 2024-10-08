import { getUserSubscriptionPlan } from '@/lib/stripe'
import TokenDisplayClient from './TokenDisplayClient'
import { TokenProvider } from '@/contexts/TokenContext'

const TokenDisplayServer = async () => {
  const subscriptionPlan = await getUserSubscriptionPlan()
  const initialTokens = subscriptionPlan.tokens || 0
  const plan = subscriptionPlan.plan || 'Free'

  return (
    <TokenProvider initialTokens={initialTokens}>
      <TokenDisplayClient initialPlan={plan} />
    </TokenProvider>
  )
}

export default TokenDisplayServer