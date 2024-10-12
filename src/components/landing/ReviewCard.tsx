import React from 'react';
import TiltCard from './TiltCard';
import { Star } from 'lucide-react';

interface Review {
  rating: number;
  quote: string;
  author: string;
  verifiedPurchase: boolean;
}

const ReviewCard: React.FC<{ review: Review; position: 'left' | 'center' | 'right' }> = ({ review, position }) => {
  return (
    <TiltCard position={position}>
      <div className="h-full flex flex-col justify-between p-4 lg:p-6 bg-white text-gray-900 rounded-md border-2 border-orange-400">
        <div>
          <div className="flex mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}
                size={16}
              />
            ))}
          </div>
          <p className="text-xs lg:text-sm mb-4 flex-grow">&quot;{review.quote}&quot;</p>
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="font-bold text-xs lg:text-sm">{review.author}</span>
          {review.verifiedPurchase && (
            <span className="text-xs text-gray-500">VERIFIED PURCHASE</span>
          )}
        </div>
      </div>
    </TiltCard>
  );
};


const ReviewCards: React.FC = () => {
  const reviews: Review[] = [
    {
      rating: 5,
      quote: "Clip Craft AI is a game-changer! The AI-generated music feature is incredible that none of the other AI video tools offer. As a content creator, I use it to quickly produce footage for my Youtube shorts. I strongly recommend!",
      author: "Alex",
      verifiedPurchase: true
    },
    {
      rating: 5,
      quote: "Cool tool for video generation! I like how I can add my own audio tracks or use the AI to generate music. I can add sound effects and music on top of the high-quality video outputs.",
      author: "Sophia",
      verifiedPurchase: true
    },
    {
      rating: 4,
      quote: "Good input = good output. Very fun to use! Took me some time to get the right footage for my videos but once I got the right input it was amazing. Clip Craft AI is very responsive to my questions.",
      author: "Marcus",
      verifiedPurchase: true
    }
  ];

  const positions: ('left' | 'center' | 'right')[] = ['left', 'center', 'right'];

  return (
    <div className="hidden lg:block relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row justify-center items-center lg:items-stretch lg:space-x-4 xl:space-x-8 space-y-8 lg:space-y-0">
        {reviews.map((review, index) => (
          <div key={index} className="w-full lg:w-1/3">
            <ReviewCard review={review} position={positions[index]} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewCards;