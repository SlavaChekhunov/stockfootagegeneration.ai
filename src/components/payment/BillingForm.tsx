'use client'

import { useState } from 'react'
import { getUserSubscriptionPlan } from '@/lib/stripe'
import { toast } from 'react-toastify'
import MaxWidthWrapper from '../MaxWidthWrapper'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'
import { format } from 'date-fns'

interface BillingFormProps {
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>
}

const PLAN_TIERS = ['Starter', 'Pro', 'Premium'] as const
type PlanTier = typeof PLAN_TIERS[number]

const BillingForm = ({ subscriptionPlan }: BillingFormProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const getNextTier = (currentPlan: string | undefined): PlanTier | null => {
    if (!currentPlan) return 'Starter'
    const currentIndex = PLAN_TIERS.indexOf(currentPlan as PlanTier)
    if (currentIndex === -1) return 'Starter'
    return currentIndex < PLAN_TIERS.length - 1 ? PLAN_TIERS[currentIndex + 1] : null
  }

  const nextTier = getNextTier(subscriptionPlan.name)

  const createStripeSession = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/create-stripe-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planName: subscriptionPlan.isSubscribed ? subscriptionPlan.name : (nextTier || 'Pro'),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create Stripe session')
      }

      const { url } = await response.json()
      if (url) {
        window.location.href = url
      } else {
        throw new Error('No URL returned from Stripe session')
      }
    } catch (error) {
      console.error('Error creating Stripe session:', error)
      toast.error('There was a problem. Please try again in a moment.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MaxWidthWrapper className='max-w-5xl'>
      <form
        className='mt-12'
        onSubmit={(e) => {
          e.preventDefault()
          createStripeSession()
        }}>
        <Card>
          <CardHeader>
            <CardTitle>Subscription Plan</CardTitle>
            <CardDescription>
              You are currently on the{' '}
              <strong>{subscriptionPlan.name || 'Free'}</strong> plan.
            </CardDescription>
          </CardHeader>

          <CardFooter className='flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0'>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? (
                <Loader2 className='mr-4 h-4 w-4 animate-spin' />
              ) : null}
              {subscriptionPlan.isSubscribed
                ? 'Manage Subscription'
                : nextTier
                ? `Upgrade to ${nextTier}`
                : 'Manage Subscription'}
            </Button>

            {subscriptionPlan.isSubscribed && subscriptionPlan.stripeCurrentPeriodEnd ? (
              <p className='rounded-full text-xs font-medium'>
                {subscriptionPlan.isCanceled
                  ? 'Your plan will be canceled on '
                  : 'Your plan renews on'}
                {format(
                  subscriptionPlan.stripeCurrentPeriodEnd,
                  'dd.MM.yyyy'
                )}
                .
              </p>
            ) : null}
          </CardFooter>
        </Card>
      </form>
    </MaxWidthWrapper>
  )
}

export default BillingForm