import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { getUserSubscriptionPlan } from '@/lib/stripe'
import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware"
import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

// Create a single rate limiter for all API routes
const apiLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(1, '60 s'),
  analytics: true,
  prefix: 'ratelimit_api',
})

async function middleware(request: NextRequest) {
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  // For API routes, implement rate limiting
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.ip ?? '127.0.0.1'
    const { success, limit, reset, remaining } = await apiLimiter.limit(ip)

    if (!success) {
      return new NextResponse('Rate limit exceeded. Please try again later.', {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      })
    }

    return NextResponse.next()
  }

  // For dashboard routes, check subscription
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!user || !user.id) {
      return NextResponse.redirect(new URL('/auth-callback?origin=/dashboard', request.url))
    }

    const subscriptionPlan = await getUserSubscriptionPlan()

    if (!subscriptionPlan.isSubscribed) {
      return NextResponse.redirect(new URL('/pricing', request.url))
    }
  }

  return NextResponse.next()
}

export default withAuth(middleware)

export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*', "/auth-callback"],
}