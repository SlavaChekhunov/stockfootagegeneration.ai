import React from 'react';
import HeroButton from './HeroButton';
import Image from 'next/image';
import { Star } from 'lucide-react'
import NavBar from '../NavBar';
import {
  RegisterLink,
} from '@kinde-oss/kinde-auth-nextjs/server'


//since theres a free plan also maybe just have a CTA button "Create your AI videos" that pulls up a kinde register link

const HeroSection: React.FC = () => {
  return (
    <div className="relative overflow-hidden">
    <div>
       <NavBar />
    </div>
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        style={{ minWidth: '100%', minHeight: '100%' }}
      >
        <source src={`https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/hero-section/rapidsave.com_drone_to_butterfly_under_water_video_transitions-wtrcz5oykgjc1.mp4`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>


      {/* Overlay to ensure text readability */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 z-10"></div>

      <div className="relative z-20  mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col md:flex-row items-center justify-center text-white">
      <div className="w-full sm:w-3/4 lg:w-2/3 xl:w-1/2 mb-10 md:mb-0">
          <div className="laurel mb-6 flex items-center justify-center relative">
            <span className="laurel-text absolute z-10 text-sm font-semibold  text-black rounded-full pb-5 invert">
              #1 AI Video App
            </span>
            <span className="laurel-stars absolute z-10 flex">
            {[...Array(5)].map((_, index) => (
              <Star key={index} size={16} fill="#fff" color="#fff" />
            ))}
          </span>
            <Image
              src={`https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/hero-section/laurel.svg`}
              alt="Laurel"
              width={185}
              height={58}
              className="laurel-img invert"
            />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-left">
            Spark your imagination
          </h1>
          <p className="text-xl mb-8">
            Create custom video clips in minutes with Clip Craft AI. Perfect for anyone with a story to tell. Our AI-powered platform transforms your ideas into high-quality, tailored clips for social media, presentations, ads, and more. Bring your vision to life with just a few prompts – no video editing skills required.
          </p>
          <ul className="space-y-2 mb-8">
            <li className="flex items-center">
              <span className="text-orange-500 mr-2">🎬</span>
              Generate custom video clips from text or images in minutes
            </li>
            <li className="flex items-center">
              <span className="text-purple-500 mr-2">🔊</span>
              Add custom audio to your creations or create AI generated music
            </li>
            <li className="flex items-center">
              <span className="text-blue-500 mr-2">🎥</span>
              Explore various camera movements and perspectives in your videos
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✨</span>
              Add custom end frames for complete control over your video creations
            </li>
          </ul>
          <RegisterLink>
            <HeroButton />
          </RegisterLink>
        </div>
      </div>

    {/* Wave divider */}
    <div className="relative z-30">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
          <path
            fill="#000000"
            fillOpacity="1"
            d="M1440,21.2101911 L1440,120 L0,120 L0,21.2101911 C120,35.0700637 240,42 360,42 C480,42 600,35.0700637 720,21.2101911 C808.32779,12.416393 874.573633,6.87702029 918.737528,4.59207306 C972.491685,1.8109458 1026.24584,0.420382166 1080,0.420382166 C1200,0.420382166 1320,7.35031847 1440,21.2101911 Z"
          ></path>
        </svg>
      </div>
    
    </div>
  );
};

export default HeroSection;