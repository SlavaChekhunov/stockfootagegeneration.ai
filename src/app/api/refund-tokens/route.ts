// src/app/api/refund-tokens/route.ts
import { NextResponse } from 'next/server';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { db } from '@/db';

export async function POST(req: Request) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { tokensToRefund } = body;

  if (typeof tokensToRefund !== 'number' || tokensToRefund <= 0) {
    return NextResponse.json({ message: 'Invalid tokensToRefund value' }, { status: 400 });
  }

  try {
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        tokens: {
          increment: tokensToRefund
        }
      }
    });

    return NextResponse.json({ message: 'Tokens refunded successfully', newTokenBalance: updatedUser.tokens });
  } catch (error) {
    console.error('Error refunding tokens:', error);
    return NextResponse.json({ message: 'Failed to refund tokens' }, { status: 500 });
  }
}