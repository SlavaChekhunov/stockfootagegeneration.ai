import VideoGenerationUI from '@/components/VideoGeneration';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import NavBar from '@/components/NavBar';
import { getUserSubscriptionPlan } from '@/lib/stripe';
import { TokenProvider } from '@/contexts/TokenContext';

const prisma = new PrismaClient()

export default async function Page() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    redirect("/auth-callback?origin=/dashboard");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser) {
    redirect("/auth-callback?origin=/dashboard");
  }

  const subscriptionPlan = await getUserSubscriptionPlan()

  if (!subscriptionPlan.isSubscribed) {
    redirect('/pricing')
  }

  const initialTokens = subscriptionPlan.tokens || 0;

  return (
    <div className="flex flex-col h-screen bg-gray-900 overflow-hidden">
      <NavBar />
      <main className="flex-grow overflow-hidden">
      <TokenProvider initialTokens={initialTokens}>
      <VideoGenerationUI />
      {/* Other components */}
    </TokenProvider>
      </main>
    </div>
  )
}