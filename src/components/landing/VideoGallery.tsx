'use client'
import { useState, useEffect, useCallback } from 'react'
import ReviewCards from './ReviewCard';
import VideoPreview from './VideoPreview';

interface VideoItem {
  id: string;
  src: string;
  name: string;
}

export default function VideoGallery() {
  const [videoItems, setVideoItems] = useState<VideoItem[]>([])
  const [displayedVideos, setDisplayedVideos] = useState<VideoItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)

  const BATCH_SIZE = 10

  const loadMoreVideos = useCallback(() => {
    if (videoItems.length > displayedVideos.length) {
      const nextBatch = videoItems.slice(
        displayedVideos.length,
        displayedVideos.length + BATCH_SIZE
      );
      setDisplayedVideos(prev => [...prev, ...nextBatch]);
    } else {
      setHasMore(false);
    }
  }, [videoItems, displayedVideos]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/landing-videos');
        if (!response.ok) {
          throw new Error('Failed to fetch videos');
        }
        const data: VideoItem[] = await response.json();
        setVideoItems(data);
        setDisplayedVideos(data.slice(0, BATCH_SIZE));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching videos:', error);
        setError('Failed to load videos. Please try again later.');
        setLoading(false);
      }
    };

    fetchVideos();
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 100
        && hasMore
        && !loading
      ) {
        loadMoreVideos();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading, loadMoreVideos]);

  const openModal = (id: string) => {
    console.log('Modal opening disabled for video:', id);
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="relative min-h-screen text-white p-4 -mt-16">
      {/* Review Cards */}
      <div className="absolute z-50 -top-5 left-1/2 transform -translate-x-1/2 w-full max-w-7xl">
        <ReviewCards />
      </div>

      {/* Shadow Gradient Overlay */}
      <div className="absolute top-20 left-0 right-0 h-96 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none"></div>
      
      <div className="grid grid-cols-1 gap-4 pt-24 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:auto-rows-[200px]">
      {displayedVideos.map((item, index) => (
          <VideoPreview
            key={item.id}
            item={item}
            openModal={openModal}
            className={index % 5 === 0 || index % 5 === 3 ? 'row-span-2' : ''}
          />
        ))}
      </div>
      {loading && <div>Loading...</div>}
    </div>
  )
}

// interface VideoPreviewProps {
//   item: VideoItem;
//   openModal: (id: number) => void;
//   className?: string;
// }

// function VideoPreview({ item, openModal, className }: VideoPreviewProps) {
//   const videoRef = useRef<HTMLVideoElement>(null);

//   const handleMouseEnter = () => {
//     if (videoRef.current) {
//       videoRef.current.play();
//     }
//   };

//   const handleMouseLeave = () => {
//     if (videoRef.current) {
//       videoRef.current.pause();
//       videoRef.current.currentTime = 0;
//     }
//   };

//   return (
//     <div 
//       className={`relative overflow-hidden rounded-lg cursor-pointer ${className}`}
//       onClick={() => openModal(item.id)}
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//     >
//       <video
//         ref={videoRef}
//         src={item.src}
//         className="w-full h-full object-cover"
//         muted
//         loop
//         playsInline
//       />
//       <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-50 rounded px-2 py-1 text-xs">
//         {item.name}
//       </div>
//     </div>
//   )
// }