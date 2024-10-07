'use client'

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const AuthCallbackComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get('origin');

  useEffect(() => {
    const syncUser = async () => {
      try {
        const response = await fetch('/api/auth-callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            router.push('/');
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          // Construct the correct redirect URL
          const redirectUrl = origin 
            ? origin.startsWith('/') ? origin : `/${origin}`
            : '/dashboard';
          
          console.log('Redirecting to:', redirectUrl); // Log the redirect URL
          router.push(redirectUrl);
        } else {
          throw new Error(data.message || 'Unknown error occurred');
        }
      } catch (error) {
        console.error('Error during auth callback:', error);
        router.push('/');
      }
    };

    syncUser();
  }, [origin, router]);

  return (
    <div className='w-full mt-24 flex justify-center'>
      <div className='flex flex-col items-center gap-2'>
        <Loader2 className='h-8 w-8 animate-spin text-zinc-800' />
        <h3 className='font-semibold text-xl'>
          Setting up your account...
        </h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
};

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthCallbackComponent />
    </Suspense>
  );
};

export default Page;