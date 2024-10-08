// src/app/api/auth-callback/route.ts
import { NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { db } from '@/db';
import { Prisma } from '@prisma/client';

export async function POST() {
  console.log('Auth callback route triggered');

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id || !user.email) {
    console.log('User not authenticated:', user);
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  console.log('Authenticated user:', user.id, user.email);

  try {
    // Try to create the user first
    const createdUser = await db.user.upsert({
      where: { id: user.id },
      update: { email: user.email }, // Update email in case it changed
      create: {
        id: user.id,
        email: user.email,
      }
    });

    console.log('User upserted successfully:', createdUser.id);

    return NextResponse.json({ success: true,  redirectUrl: '/pricing'  });
  } catch (error) {
    console.error('Error syncing user:', error);
    
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      errorMessage = `Database error: ${error.message}`;
      console.error('Prisma error code:', error.code);
      console.error('Prisma error meta:', error.meta);
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    // Log the full error object for debugging
    console.error('Full error object:', JSON.stringify(error, null, 2));

    return NextResponse.json(
      { success: false, message: 'Internal server error', error: errorMessage },
      { status: 500 }
    );
  }
}