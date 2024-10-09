import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { getUserSubscriptionPlan } from '@/lib/stripe'
import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware"

async function middleware(request: NextRequest) {
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  // For API routes, we don't need to do anything extra
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // For dashboard routes, check subscription
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!user || !user.id) {
      return NextResponse.redirect(new URL('/auth-callback?origin=/dashboard', request.url))
    }

    const subscriptionPlan = await getUserSubscriptionPlan()

    if (!subscriptionPlan.isSubscribed) {
      return NextResponse.redirect(new URL('/dashboard/billing', request.url))
    }
  }

  return NextResponse.next()
}

export default withAuth(middleware)

export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*', "/auth-callback"],
}