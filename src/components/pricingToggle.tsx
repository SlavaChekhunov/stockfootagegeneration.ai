'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function PricingToggle() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSubscription, setIsSubscription] = useState(searchParams.get('type') !== 'onetime')

  useEffect(() => {
    setIsSubscription(searchParams.get('type') !== 'onetime')
  }, [searchParams])

  return (
    <div className='flex justify-center space-x-4 mb-8'>
      <button
        onClick={() => router.push('/pricing?type=onetime')}
        className={`px-4 py-2 rounded-full ${!isSubscription ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
      >
        One-time Purchase
      </button>
      <button
        onClick={() => router.push('/pricing?type=subscription')}
        className={`px-4 py-2 rounded-full ${isSubscription ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
      >
        Monthly Subscription
      </button>
    </div>
  )
}