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
      <div className="h-full flex flex-col justify-between p-6 bg-white text-gray-900 rounded-md border-2 border-orange-400">
        <div>
          <div className="flex mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}
                size={20}
              />
            ))}
          </div>
          <p className="text-sm mb-4 flex-grow">&quot;{review.quote}&quot;</p>
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="font-bold text-sm">{review.author}</span>
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
      quote: "Stock AI is incredible! I create stunning video footage for my social media content in minutes. As a content creator, I use it to test concepts before investing in expensive production. The control over camera movements and scenes is unparalleled. Highly recommend!",
      author: "Alex",
      verifiedPurchase: true
    },
    {
      rating: 5,
      quote: "Amazing AI tool for video generation! I've created professional-looking stock footage for various locations and scenarios. The ability to add custom audio and adjust video length is game-changing. My followers are blown away by the quality!",
      author: "Sophia",
      verifiedPurchase: true
    },
    {
      rating: 4,
      quote: "Precise prompts yield fantastic results. It's incredibly fun! Took some practice to master scene composition, but once I got it right, the output was mind-blowing. The audio sync feature is particularly impressive. Stock AI's customer support was very helpful.",
      author: "Marcus",
      verifiedPurchase: true
    }
  ];

  const positions: ('left' | 'center' | 'right')[] = ['left', 'center', 'right'];

  return (
    <div className="relative w-full max-w-7xl mx-auto">
      <div className="flex justify-center items-center space-x-20">
        {reviews.map((review, index) => (
          <ReviewCard key={index} review={review} position={positions[index]} />
        ))}
      </div>
    </div>
  );
};

export default ReviewCards;