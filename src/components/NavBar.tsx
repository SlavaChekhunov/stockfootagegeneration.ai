import Link from 'next/link'
import MaxWidthWrapper from './MaxWidthWrapper'
import { buttonVariants } from './ui/button'
import {
  LoginLink,
  RegisterLink,
  LogoutLink,
  getKindeServerSession,
} from '@kinde-oss/kinde-auth-nextjs/server'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'

const NavBar = async () => {
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  return (
    <nav className='sticky h-14 inset-x-0 top-0 z-30 w-full  bg-transparent backdrop-blur-sm transition-all text-white'>
      <MaxWidthWrapper>
        <div className='flex h-14 items-center justify-between '>
        <Link
          href='/'
          className='flex z-40 items-center'>
          <Image 
            src="/stock-ai-logo.svg"
            alt="Stock.ai Logo"
            width={180}
            height={42}
            className="mr-2"
          />
        </Link>

          <div className='hidden items-center space-x-4 sm:flex'>
            {!user ? (
              <>
                <Link
                  href='/pricing'
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  })}>
                  Pricing
                </Link>
                <LoginLink
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  })}>
                  Sign in
                </LoginLink>
                <RegisterLink
                  className="relative px-6 py-2 font-bold text-white rounded-full overflow-hidden group">
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500 via-blue-500 via-green-500 to-orange-500 animate-gradient-x"></span>
                  <span className="relative flex items-center">
                    Get started
                    <ArrowRight className='ml-1.5 h-5 w-5' />
                  </span>
                </RegisterLink>
              </>
            ) : (
              <>
                <Link
                  href='/dashboard'
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  })}>
                  Dashboard
                </Link>
                <LogoutLink
                  className={buttonVariants({
                    size: 'sm',
                    variant: 'ghost',
                  })}>
                  Log out
                </LogoutLink>
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  )
}

export default NavBar