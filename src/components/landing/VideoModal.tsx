// import { useEffect, useState } from 'react'
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Heart, X, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

// interface VideoItem {
//   id: string;
//   src: string;
//   name: string;
//   prompt: string;
//   modelVersion: string;
//   videoRatio: string;
//   creativityRelevance: number;
//   mode: string;
//   length: string;
//   cameraMovement: string;
//   likes: number;
// }

// interface VideoModalProps {
//   isOpen: boolean;
//   setIsOpen: (isOpen: boolean) => void;
//   initialVideoId: string;
//   videos: VideoItem[];
// }

// export default function VideoModal({ isOpen, setIsOpen, initialVideoId, videos }: VideoModalProps) {
//   const [currentVideoIndex, setCurrentVideoIndex] = useState(0)

//   useEffect(() => {
//     const index = videos.findIndex(v => v.id === initialVideoId)
//     if (index !== -1) {
//       setCurrentVideoIndex(index)
//     }
//   }, [initialVideoId, videos])

//   const currentVideo = videos[currentVideoIndex]

//   const nextVideo = () => {
//     setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length)
//   }

//   const prevVideo = () => {
//     setCurrentVideoIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length)
//   }

//   if (!currentVideo) return null

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogContent className="max-w-6xl p-0 overflow-hidden">
//         <DialogHeader className="absolute top-2 right-2 z-10">
//           <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
//             <X className="h-4 w-4" />
//           </Button>
//         </DialogHeader>
//         <div className="flex h-[80vh]">
//           <div className="w-2/3 relative bg-black">
//             <video 
//               src={currentVideo.src} 
//               className="w-full h-full object-cover" 
//               autoPlay 
//               loop 
//               muted 
//             />
//             <div className="absolute bottom-4 left-4 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
//               KLING AI+
//             </div>
//           </div>
//           <div className="w-1/3 bg-gray-900 text-white p-6 overflow-y-auto">
//             <DialogTitle className="text-2xl font-bold mb-4">Details</DialogTitle>
//             <div className="bg-gray-800 text-green-400 inline-block px-2 py-1 rounded mb-4">Video</div>
//             <div className="space-y-4">
//               <div>
//                 <h3 className="text-gray-400">Name</h3>
//                 <p>{currentVideo.name}</p>
//               </div>
//               <div>
//                 <h3 className="text-gray-400">Prompt</h3>
//                 <p>{currentVideo.prompt}</p>
//               </div>
//               <div>
//                 <h3 className="text-gray-400">Model Version</h3>
//                 <p>{currentVideo.modelVersion}</p>
//               </div>
//               <div>
//                 <h3 className="text-gray-400">Video Ratio</h3>
//                 <p>{currentVideo.videoRatio}</p>
//               </div>
//               <div>
//                 <h3 className="text-gray-400">Creativity Relevance</h3>
//                 <p>{currentVideo.creativityRelevance}</p>
//               </div>
//               <div>
//                 <h3 className="text-gray-400">Mode</h3>
//                 <p>{currentVideo.mode}</p>
//               </div>
//               <div>
//                 <h3 className="text-gray-400">Length</h3>
//                 <p>{currentVideo.length}</p>
//               </div>
//               <div>
//                 <h3 className="text-gray-400">Camera Movement</h3>
//                 <p>{currentVideo.cameraMovement}</p>
//               </div>
//             </div>
//             <div className="flex justify-between items-center mt-6">
//               <Button variant="ghost" className="text-white">
//                 <Heart className="h-5 w-5 mr-2" />
//                 {currentVideo.likes}
//               </Button>
//               <Button variant="ghost" className="text-white">
//                 <MoreHorizontal className="h-5 w-5" />
//               </Button>
//               <Button className="bg-green-500 hover:bg-green-600 text-white">
//                 Clone & Try
//               </Button>
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//       <div className="fixed top-1/2 left-4 transform -translate-y-1/2">
//         <Button variant="ghost" size="icon" onClick={prevVideo} className="text-white">
//           <ChevronLeft className="h-8 w-8" />
//         </Button>
//       </div>
//       <div className="fixed top-1/2 right-4 transform -translate-y-1/2">
//         <Button variant="ghost" size="icon" onClick={nextVideo} className="text-white">
//           <ChevronRight className="h-8 w-8" />
//         </Button>
//       </div>
//     </Dialog>
//   )
// }