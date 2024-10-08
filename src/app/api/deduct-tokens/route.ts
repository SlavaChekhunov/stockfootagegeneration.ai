import { NextResponse } from 'next/server'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { db } from '@/db'
import { getUserSubscriptionPlan } from '@/lib/stripe'

export async function POST() {
  try {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user || !user.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const userPlan = await getUserSubscriptionPlan()

    if (userPlan.tokens < 50) {
      return NextResponse.json({ message: 'Not enough tokens' }, { status: 400 })
    }

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: { tokens: { decrement: 50 } },
    })

    return NextResponse.json({ tokens: updatedUser.tokens })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}