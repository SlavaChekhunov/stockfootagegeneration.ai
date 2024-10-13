'use client'

import { LoginLink, RegisterLink, LogoutLink  } from '@kinde-oss/kinde-auth-nextjs/components'
import { ArrowRight, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const MobileNav = ({ isAuth }: { isAuth: boolean }) => {
  const [isOpen, setOpen] = useState<boolean>(false)

  const toggleOpen = () => setOpen((prev) => !prev)

  const pathname = usePathname()

  useEffect(() => {
    if (isOpen) toggleOpen()
  }, [pathname])

  const closeOnCurrent = (href: string) => {
    if (pathname === href) {
      toggleOpen()
    }
  }

  return (
    <div className='sm:hidden'>
      <button
        onClick={toggleOpen}
        className='fixed top-2 right-2 z-50 p-3 rounded-full overflow-hidden group'
      >
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500 via-blue-500 via-green-500 to-orange-500 animate-gradient-x"></span>
        {isOpen ? (
          <X className='relative z-50 h-6 w-6 text-white' />
        ) : (
          <Menu className='relative z-50 h-6 w-6 text-white' />
        )}
      </button>

      {isOpen && (
        <div className='fixed animate-in slide-in-from-top-5 fade-in-20 inset-0 z-40 w-full'>
          <ul className='absolute bg-black border-b border-zinc-800 shadow-xl grid w-full gap-6 px-10 pt-20 pb-60 h-full'>
          {!isAuth ? (
              <>
                <li>
                  <RegisterLink
                    className="relative w-full px-6 py-3 font-bold text-white rounded-full overflow-hidden group">
                    <span className="relative flex items-center justify-center inset-0 w-full h-2/3 bg-gradient-to-r from-purple-500 via-blue-500 via-green-500 to-orange-500 animate-gradient-x rounded-full">
                      Get started
                      <ArrowRight className='ml-2 h-5 w-5' />
                    </span>
                  </RegisterLink>
                </li>
                <li>
                  <Link
                    onClick={() => closeOnCurrent('/pricing')}
                    className='flex items-center justify-center w-full px-6 py-3 font-semibold text-black bg-white rounded-full'
                    href='/pricing'>
                    Pricing
                  </Link>
                </li>
                <li>
                  <LoginLink
                     className='flex items-center justify-center w-full px-6 py-3 font-semibold text-black bg-white rounded-full'>
                      Sign In
                  </LoginLink>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    onClick={() => closeOnCurrent('/dashboard')}
                    className='flex items-center justify-center w-full px-6 py-3 font-semibold text-black bg-white rounded-full'
                    href='/dashboard'>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <LogoutLink className='flex items-center justify-center w-full px-6 py-3 font-semibold text-black bg-white rounded-full' >
                    Log out
                  </LogoutLink>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

export default MobileNav