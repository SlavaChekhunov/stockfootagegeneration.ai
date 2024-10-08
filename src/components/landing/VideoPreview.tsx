import { useRef } from 'react';

interface VideoItem {
  id: string;
  src: string;
  name: string;
}

interface VideoPreviewProps {
  item: VideoItem;
  openModal: (id: string) => void;
  className?: string;
}

export default function VideoPreview({ item, openModal, className }: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div 
      className={`relative overflow-hidden rounded-lg cursor-pointer ${className}`}
      onClick={() => openModal(item.id)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={item.src}
        className="w-full h-full object-cover"
        muted
        loop
        playsInline
      />
      {/* <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-50 rounded px-2 py-1 text-xs">
        {item.name}
      </div> */}
    </div>
  )
}