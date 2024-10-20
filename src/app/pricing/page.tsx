import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import UpgradeButton from '@/components/payment/UpgradeButton'
import PricingToggle from '@/components/pricingToggle'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { PLANS, ONE_TIME_PURCHASES } from '../../config/stripe'
import { cn } from '@/lib/utils'
import { getKindeServerSession, RegisterLink } from '@kinde-oss/kinde-auth-nextjs/server'
import {
  ArrowRight,
  Check,
  HelpCircle,
  Minus,
} from 'lucide-react'

interface FeatureItem {
  text: string;
  negative?: boolean;
  footnote?: string;
}

interface PricingPlan {
  plan: string;
  tagline: string;
  price: number;
  quota: number;
  features: FeatureItem[];
}


export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const isSubscription = searchParams.type !== 'onetime'

  const subscriptionPlans: PricingPlan[] = [
    {
      plan: 'Starter',
      tagline: 'For individuals getting started.',
      price: PLANS.find((p) => p.slug === 'starter')!.price.amount,
      quota: PLANS.find((p) => p.slug === 'starter')!.quota,
      features: [
        { text: '860 Credits per month' },
        { text: 'Generate 1 video at a time' },
        { text: 'Basic Fast-Track Generation' },
        { text: 'Remove watermarks' },
        { text: 'Standard quality videos' },
        { text: 'Generate videos with audio' },
        { text: 'Email support' },
      ],
    },
    {
      plan: 'Pro',
      tagline: 'For professionals and film enthusiasts.',
      price: PLANS.find((p) => p.slug === 'pro')!.price.amount,
      quota: PLANS.find((p) => p.slug === 'pro')!.quota,
      features: [
        { text: '2000 Credits per month' },
        { text: 'Generate 3 videos at a time' },
        { text: 'Advanced Fast-Track Generation' },
        { text: 'Remove watermarks' },
        { text: 'Professional Mode videos' },
        { text: 'Generate videos with audio' },
        { text: 'Priority email support' },
      ],
    },
    {
      plan: 'Premium',
      tagline: 'For film makers and high-volume users.',
      price: PLANS.find((p) => p.slug === 'premium')!.price.amount,
      quota: PLANS.find((p) => p.slug === 'premium')!.quota,
      features: [
        { text: '8,000 Credits per month' },
        { text: 'Generate 4 videos at a time' },
        { text: 'Exclusive Fast-Track Generation' },
        { text: 'Remove watermarks' },
        { text: 'Premium Features: Video Extension' },
        { text: 'Generate videos with audio' },
        { text: '24/7 Priority support' },
      ],
    },
  ]
  
  const oneTimePurchases: PricingPlan[] = [
    {
      plan: 'Starter',
      tagline: 'For quick projects and trials.',
      price: ONE_TIME_PURCHASES.find((p) => p.slug === '120-tokens')!.price.amount,
      quota: ONE_TIME_PURCHASES.find((p) => p.slug === '120-tokens')!.tokens,
      features: [
        { text: '120 Credits' },
        { text: 'Generate 1 video at a time' },
        { text: 'Standard Fast-Track Generation' },
        { text: 'Remove watermarks' },
        { text: 'Standard quality videos' },
        { text: 'Generate videos with audio' },
        { text: 'Email support' },
      ],
    },
    {
      plan: 'Pro',
      tagline: 'For medium-sized projects.',
      price: ONE_TIME_PURCHASES.find((p) => p.slug === '540-tokens')!.price.amount,
      quota: ONE_TIME_PURCHASES.find((p) => p.slug === '540-tokens')!.tokens,
      features: [
        { text: '540 Credits' },
        { text: 'Generate 2 videos at a time' },
        { text: 'Advanced Fast-Track Generation' },
        { text: 'Remove watermarks' },
        { text: 'High quality videos' },
        { text: 'Generate videos with audio' },
        { text: 'Priority email support' },
      ],
    },
    {
      plan: 'Premium',
      tagline: 'For large projects and power users.',
      price: ONE_TIME_PURCHASES.find((p) => p.slug === '1100-tokens')!.price.amount,
      quota: ONE_TIME_PURCHASES.find((p) => p.slug === '1100-tokens')!.tokens,
      features: [
        { text: '1100 Credits' },
        { text: 'Generate 3 videos at a time' },
        { text: 'Exclusive Fast-Track Generation' },
        { text: 'Remove watermarks' },
        { text: 'Premium quality videos' },
        { text: 'Generate videos with audio' },
        { text: '24/7 Priority support' },
      ],
    },
  ]
    
    const pricingItems = isSubscription ? subscriptionPlans : oneTimePurchases

    return (
      <div className="bg-black text-white min-h-screen w-full flex flex-col">
        <MaxWidthWrapper className='flex-grow flex flex-col justify-center items-center max-w-7xl mx-auto w-full text-center'>
          <div className='mx-auto mb-8 sm:max-w-lg'>
            <h1 className='text-5xl font-bold sm:text-6xl'>
              Pricing
            </h1>
            <p className='mt-4 text-gray-400 sm:text-lg'>
              Choose the perfect plan for your creative needs.
            </p>
          </div>
  
          <PricingToggle />
  
          <div className='pt-8 grid grid-cols-1 gap-8 lg:grid-cols-3'>
            <TooltipProvider>
              {pricingItems.map(
                ({ plan, price, quota, features }) => {
                  return (
                    <div
                      key={plan}
                      className={cn(
                        'relative rounded-2xl bg-gray-900 shadow-lg px-4 py-6',
                        {
                          'border-2 border-blue-600 shadow-blue-200':
                            plan === 'Pro' || plan === 'Standard',
                          'border border-gray-700':
                            plan !== 'Pro' && plan !== 'Standard',
                        }
                      )}>
                      {(plan === 'Pro' || plan === 'Standard') && (
                        <div className='absolute -top-4 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-3 py-1 text-xs font-medium text-white'>
                          Most Popular
                        </div>
                      )}
              
                      <div className='pb-3'>
                        <h3 className='text-center font-display text-2xl font-bold'>
                          {plan}
                        </h3>
                        <p className='mt-3 font-display text-4xl font-semibold'>
                          ${price}
                        </p>
                        <p className='text-gray-400 text-xs'>
                          {isSubscription ? 'per month' : 'one-time purchase'}
                        </p>
                      </div>
  
                      <div className='flex h-16 items-center justify-center border-b border-t border-gray-700 bg-gray-800 text-sm'>
                        <div className='flex items-center space-x-1'>
                          <p>
                            {quota.toLocaleString()} Credits
                          </p>
  
                          <Tooltip delayDuration={300}>
                            <TooltipTrigger className='cursor-default ml-1'>
                              <HelpCircle className='h-3 w-3 text-zinc-400' />
                            </TooltipTrigger>
                            <TooltipContent className='w-60 p-2 text-xs bg-gray-800 text-white'>
                              {isSubscription ? 'Credits per month' : 'One-time credit purchase'}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
  
                      {features && (
                        <ul className='my-6 space-y-3 px-4 text-sm'>
                          {features.map(
                            ({ text, negative, footnote }: FeatureItem) => (
                              <li
                                key={text}
                                className='flex space-x-3'>
                                <div className='flex-shrink-0'>
                                  {negative ? (
                                    <Minus className='h-4 w-4 text-gray-500' />
                                  ) : (
                                    <Check className='h-4 w-4 text-blue-500' />
                                  )}
                                </div>
                                {footnote ? (
                                  <div className='flex items-center space-x-1'>
                                    <p
                                      className={cn(
                                        'text-gray-300',
                                        {
                                          'text-gray-500':
                                            negative,
                                        }
                                      )}>
                                      {text}
                                    </p>
                                    <Tooltip
                                      delayDuration={300}>
                                      <TooltipTrigger className='cursor-default ml-1'>
                                        <HelpCircle className='h-3 w-3 text-zinc-400' />
                                      </TooltipTrigger>
                                      <TooltipContent className='w-60 p-2 text-xs bg-gray-800 text-white'>
                                        {footnote}
                                      </TooltipContent>
                                    </Tooltip>
                                  </div>
                                ) : (
                                  <p
                                    className={cn(
                                      'text-gray-300',
                                      {
                                        'text-gray-500':
                                          negative,
                                      }
                                    )}>
                                    {text}
                                  </p>
                                )}
                              </li>
                            )
                          )}
                        </ul>
                      )}
  
                      <div className='border-t border-gray-700' />
                      <div className='p-4'>
                        {user ? (
                          <UpgradeButton 
                          planName={isSubscription ? plan : `${quota}-tokens`} 
                          isSubscription={isSubscription}
                        >
                          {isSubscription ? `Upgrade to ${plan}` : `Purchase ${quota} Credits`}
                          <ArrowRight className='h-5 w-5 ml-1.5' />
                        </UpgradeButton>
                        ) : (
                          <RegisterLink className="block w-full">
                            <span className="relative flex items-center justify-center w-full px-6 py-3 text-white bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 rounded-full hover:from-purple-600 hover:via-blue-600 hover:to-green-600 transition-all duration-200">
                              Get started
                              <ArrowRight className='h-5 w-5 ml-1.5' />
                            </span>
                          </RegisterLink>
                        )}
                      </div>
                    </div>
                  )
                }
              )}
            </TooltipProvider>
          </div>
        </MaxWidthWrapper>
      </div>
    )
  }