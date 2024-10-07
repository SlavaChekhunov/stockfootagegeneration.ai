import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import UpgradeButton from '@/components/payment/UpgradeButton'
import { buttonVariants } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { PLANS } from '../../config/stripe'
import { cn } from '@/lib/utils'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import {
  ArrowRight,
  Check,
  HelpCircle,
  Minus,
} from 'lucide-react'
import Link from 'next/link'

export default async function Page() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const pricingItems = [
    {
      plan: 'Starter',
      tagline: 'For individuals getting started.',
      price: PLANS.find((p) => p.slug === 'starter')!.price.amount,
      quota: PLANS.find((p) => p.slug === 'starter')!.quota,
      features: [
        { text: '660 Credits per month' },
        { text: 'Generate 1 image at a time' },
        { text: 'Basic Fast-Track Generation' },
        { text: 'Remove watermarks' },
        { text: 'Standard quality videos' },
        { text: 'Basic image enhancement' },
        { text: 'Email support', negative: false },
      ],
    },
    {
      plan: 'Pro',
      tagline: 'For professionals and small teams.',
      price: PLANS.find((p) => p.slug === 'pro')!.price.amount,
      quota: PLANS.find((p) => p.slug === 'pro')!.quota,
      features: [
        { text: '3000 Credits per month' },
        { text: 'Generate up to 5 images simultaneously' },
        { text: 'Advanced Fast-Track Generation' },
        { text: 'Remove watermarks' },
        { text: 'Professional Mode videos' },
        { text: 'Advanced image enhancement' },
        { text: 'Priority email support' },
        { text: 'Basic API access' },
      ],
    },
    {
      plan: 'Premium',
      tagline: 'For businesses with high-volume needs.',
      price: PLANS.find((p) => p.slug === 'premium')!.price.amount,
      quota: PLANS.find((p) => p.slug === 'premium')!.quota,
      features: [
        { text: '10,000 Credits per month' },
        { text: 'Unlimited simultaneous image generation' },
        { text: 'Exclusive Fast-Track Generation' },
        { text: 'Remove watermarks' },
        { text: 'Ultra-HD video generation' },
        { text: 'Premium Features: Video Extension, Master Shots' },
        { text: 'Advanced AI-powered image enhancement' },
        { text: '24/7 Priority support' },
        { text: 'Full API access' },
        { text: 'Custom integration support' },
      ],
    },
  ]

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

        <div className='pt-8 grid grid-cols-1 gap-8 lg:grid-cols-3'>
          <TooltipProvider>
            {pricingItems.map(
              ({ plan, tagline, price, quota, features }) => {
                return (
                  <div
                    key={plan}
                    className={cn(
                      'relative rounded-2xl bg-gray-900 shadow-lg px-4 py-6',
                      {
                        'border-2 border-blue-600 shadow-blue-200':
                          plan === 'Pro',
                        'border border-gray-700':
                          plan !== 'Pro',
                      }
                    )}>
                    {plan === 'Pro' && (
                      <div className='absolute -top-4 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-3 py-1 text-xs font-medium text-white'>
                        Most Popular
                      </div>
                    )}

                    <div className='pb-3'>
                      <h3 className='text-center font-display text-2xl font-bold'>
                        {plan}
                      </h3>
                      <p className='text-gray-400 text-sm'>
                        {tagline}
                      </p>
                      <p className='mt-3 font-display text-4xl font-semibold'>
                        ${price}
                      </p>
                      <p className='text-gray-400 text-xs'>
                        per month
                      </p>
                    </div>

                    <div className='flex h-16 items-center justify-center border-b border-t border-gray-700 bg-gray-800 text-sm'>
                      <div className='flex items-center space-x-1'>
                        <p>
                          {quota.toLocaleString()} Credits per month
                        </p>

                        <Tooltip delayDuration={300}>
                          <TooltipTrigger className='cursor-default ml-1'>
                            <HelpCircle className='h-3 w-3 text-zinc-400' />
                          </TooltipTrigger>
                          <TooltipContent className='w-60 p-2 text-xs bg-gray-800 text-white'>
                            How many credits you can use per month.
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>

                    <ul className='my-6 space-y-3 px-4 text-sm'>
                      {features.map(
                        ({ text, negative, footnote }: { text: string; negative?: boolean; footnote?: string }) => (
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

                    <div className='border-t border-gray-700' />
                    <div className='p-4'>
                      {user ? (
                        <UpgradeButton planName={plan}>
                          Upgrade to {plan} <ArrowRight className='h-5 w-5 ml-1.5' />
                        </UpgradeButton>
                      ) : (
                        <Link
                          href='/sign-in'
                          className={buttonVariants({
                            className: 'w-full relative px-6 py-3 font-bold text-white rounded-full overflow-hidden group',
                          })}>
                          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500 via-blue-500 via-green-500 to-orange-500 animate-gradient-x"></span>
                          <span className="relative flex items-center justify-center">
                            Get started
                            <ArrowRight className='h-4 w-4 ml-1.5' />
                          </span>
                        </Link>
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