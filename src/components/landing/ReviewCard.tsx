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
      quote: "Photo AI is just fantastic! I take amazing photos of my wife, family and friends. As a photographer I use it to test ideas before creating a real photoshoot. I strongly recommend!",
      author: "Everaldo",
      verifiedPurchase: true
    },
    {
      rating: 5,
      quote: "Cool AI tool for image generation! I could create a lot of truly amazing pictures in different locations with different outfits! All my friends were surprised and loved my pictures!",
      author: "Iryna",
      verifiedPurchase: true
    },
    {
      rating: 4,
      quote: "Good input = good output. Very fun! Took me some effort to get the models to feel accurate but once I got the right input it was amazing. Photo AI was very responsive to my questions.",
      author: "Jordan",
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