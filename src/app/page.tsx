// app/page.tsx
import VideoGallery from '@/components/landing/VideoGallery';
import HeroSection from '@/components/landing/HeroSection';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-black  ">
      <HeroSection />
      <VideoGallery />
    </main>
  );
}