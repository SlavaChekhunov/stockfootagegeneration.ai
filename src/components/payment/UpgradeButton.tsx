"use client"

import React, { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'

interface UpgradeButtonProps {
  planName: string;
  children: React.ReactNode;
}

const UpgradeButton: React.FC<UpgradeButtonProps> = ({ planName, children }) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleUpgrade = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/create-stripe-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planName }),
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
    } catch (error: unknown) {
      console.error('Error creating Stripe session:', error)
      
      let errorMessage = 'An error occurred. Please try again.'
      if (error instanceof Error) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleUpgrade}
      disabled={isLoading}
      className="relative w-full px-6 py-3 font-bold text-white rounded-full overflow-hidden group"
    >
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500 via-blue-500 via-green-500 to-orange-500 animate-gradient-x"></span>
      <span className="relative flex items-center justify-center">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Upgrading...
          </>
        ) : (
          children
        )}
      </span>
    </button>
  );
};

export default UpgradeButton;