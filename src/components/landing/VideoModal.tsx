import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Heart, X, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

interface VideoDetails {
  id: number
  src: string
  prompt: string
  modelVersion: string
  videoRatio: string
  creativityRelevance: number
  mode: string
  length: string
  cameraMovement: string
  likes: number
}

//**change the path for each video  */




const videos: VideoDetails[] = [
  {
    id: 1,
    src: "assets/videos/High_Quality_16x9_extreme_close_up_with_a_shallow_.mp4",
    prompt: "extreme close-up with a shallow depth of field of a puddle in a street reflecting a busy futuristic Tokyo city with bright neon signs, night, lens flare",
    modelVersion: "KLING1.0",
    videoRatio: "16 : 9",
    creativityRelevance: 0.5,
    mode: "Professional Mode",
    length: "5s",
    cameraMovement: "Camera Movement",
    likes: 13812
  },
  {
    id: 2,
    src: "assets/videos/High_Performance_16x9_The_camera_looks_down_at_a_volca.mp4",
    prompt: "extreme close-up with a shallow depth of field of a puddle in a street reflecting a busy futuristic Tokyo city with bright neon signs, night, lens flare",
    modelVersion: "KLING1.0",
    videoRatio: "16 : 9",
    creativityRelevance: 0.5,
    mode: "Professional Mode",
    length: "5s",
    cameraMovement: "Camera Movement",
    likes: 13812
  },
  {
    id: 3,
    src: "assets/videos/High_Performance_A_hunting_dragon__flying_sand__a.mp4",
    prompt: "extreme close-up with a shallow depth of field of a puddle in a street reflecting a busy futuristic Tokyo city with bright neon signs, night, lens flare",
    modelVersion: "KLING1.0",
    videoRatio: "16 : 9",
    creativityRelevance: 0.5,
    mode: "Professional Mode",
    length: "5s",
    cameraMovement: "Camera Movement",
    likes: 13812
  },
  {
    id: 4,
    src: "assets/videos/High_Performance_Car_driving_at_high_speed_on_the.mp4",
    prompt: "extreme close-up with a shallow depth of field of a puddle in a street reflecting a busy futuristic Tokyo city with bright neon signs, night, lens flare",
    modelVersion: "KLING1.0",
    videoRatio: "16 : 9",
    creativityRelevance: 0.5,
    mode: "Professional Mode",
    length: "5s",
    cameraMovement: "Camera Movement",
    likes: 13812
  },
  {
    id: 5,
    src: "assets/videos/High_Performance_The_lake_surface_is_sparkling__c.mp4",
    prompt: "extreme close-up with a shallow depth of field of a puddle in a street reflecting a busy futuristic Tokyo city with bright neon signs, night, lens flare",
    modelVersion: "KLING1.0",
    videoRatio: "16 : 9",
    creativityRelevance: 0.5,
    mode: "Professional Mode",
    length: "5s",
    cameraMovement: "Camera Movement",
    likes: 13812
  },
  {
    id: 6,
    src: "assets/videos/High_Performance_Wind_blowing_bamboo_leaves__snow.mp4",
    prompt: "extreme close-up with a shallow depth of field of a puddle in a street reflecting a busy futuristic Tokyo city with bright neon signs, night, lens flare",
    modelVersion: "KLING1.0",
    videoRatio: "16 : 9",
    creativityRelevance: 0.5,
    mode: "Professional Mode",
    length: "5s",
    cameraMovement: "Camera Movement",
    likes: 13812
  },
  {
    id: 7,
    src: "assets/videos/High_Quality__Cute_cat_walking_among_flowers_.mp4",
    prompt: "extreme close-up with a shallow depth of field of a puddle in a street reflecting a busy futuristic Tokyo city with bright neon signs, night, lens flare",
    modelVersion: "KLING1.0",
    videoRatio: "16 : 9",
    creativityRelevance: 0.5,
    mode: "Professional Mode",
    length: "5s",
    cameraMovement: "Camera Movement",
    likes: 13812
  },
  {
    id: 8,
    src: "assets/videos/High_Quality_9x16_Telephoto_lens_shot__ground_shot.mp4",
    prompt: "extreme close-up with a shallow depth of field of a puddle in a street reflecting a busy futuristic Tokyo city with bright neon signs, night, lens flare",
    modelVersion: "KLING1.0",
    videoRatio: "16 : 9",
    creativityRelevance: 0.5,
    mode: "Professional Mode",
    length: "5s",
    cameraMovement: "Camera Movement",
    likes: 13812
  },
  {
    id: 9,
    src: "assets/videos/High_Quality_16x9_A_cat_wearing_an_astronaut_helme.mp4",
    prompt: "extreme close-up with a shallow depth of field of a puddle in a street reflecting a busy futuristic Tokyo city with bright neon signs, night, lens flare",
    modelVersion: "KLING1.0",
    videoRatio: "16 : 9",
    creativityRelevance: 0.5,
    mode: "Professional Mode",
    length: "5s",
    cameraMovement: "Camera Movement",
    likes: 13812
  },
  {
    id: 10,
    src: "assets/videos/High_Quality_16x9_A_cute_little_rabbit__wearing_gl.mp4",
    prompt: "extreme close-up with a shallow depth of field of a puddle in a street reflecting a busy futuristic Tokyo city with bright neon signs, night, lens flare",
    modelVersion: "KLING1.0",
    videoRatio: "16 : 9",
    creativityRelevance: 0.5,
    mode: "Professional Mode",
    length: "5s",
    cameraMovement: "Camera Movement",
    likes: 13812
  },
  {
    id: 11,
    src: "assets/videos/High_Quality_16x9_A_lion_with_eagle_wings_patrols_.mp4",
    prompt: "extreme close-up with a shallow depth of field of a puddle in a street reflecting a busy futuristic Tokyo city with bright neon signs, night, lens flare",
    modelVersion: "KLING1.0",
    videoRatio: "16 : 9",
    creativityRelevance: 0.5,
    mode: "Professional Mode",
    length: "5s",
    cameraMovement: "Camera Movement",
    likes: 13812
  },
  {
    id: 12,
    src: "assets/videos/High_Quality_16x9_A_medieval_sailboat_sailing_on_t.mp4",
    prompt: "extreme close-up with a shallow depth of field of a puddle in a street reflecting a busy futuristic Tokyo city with bright neon signs, night, lens flare",
    modelVersion: "KLING1.0",
    videoRatio: "16 : 9",
    creativityRelevance: 0.5,
    mode: "Professional Mode",
    length: "5s",
    cameraMovement: "Camera Movement",
    likes: 13812
  },
  {
    id: 13,
    src: "assets/videos/High_Quality_16x9_An_adorable_black_and_white_bord.mp4",
    prompt: "extreme close-up with a shallow depth of field of a puddle in a street reflecting a busy futuristic Tokyo city with bright neon signs, night, lens flare",
    modelVersion: "KLING1.0",
    videoRatio: "16 : 9",
    creativityRelevance: 0.5,
    mode: "Professional Mode",
    length: "5s",
    cameraMovement: "Camera Movement",
    likes: 13812
  },
  {
    id: 14,
    src: "assets/videos/High_Quality_16x9_Carefully_pour_the_milk_into_the.mp4",
    prompt: "extreme close-up with a shallow depth of field of a puddle in a street reflecting a busy futuristic Tokyo city with bright neon signs, night, lens flare",
    modelVersion: "KLING1.0",
    videoRatio: "16 : 9",
    creativityRelevance: 0.5,
    mode: "Professional Mode",
    length: "5s",
    cameraMovement: "Camera Movement",
    likes: 13812
  },
  {
    id: 15,
    src: "assets/videos/High_Quality_16x9_Close_up__the_early_morning_sun_.mp4",
    prompt: "extreme close-up with a shallow depth of field of a puddle in a street reflecting a busy futuristic Tokyo city with bright neon signs, night, lens flare",
    modelVersion: "KLING1.0",
    videoRatio: "16 : 9",
    creativityRelevance: 0.5,
    mode: "Professional Mode",
    length: "5s",
    cameraMovement: "Camera Movement",
    likes: 13812
  },
  {
    id: 16,
    src: "assets/videos/High_Performance_16x9_Astronauts_built_bases_on_the_su.mp4",
    prompt: "extreme close-up with a shallow depth of field of a puddle in a street reflecting a busy futuristic Tokyo city with bright neon signs, night, lens flare",
    modelVersion: "KLING1.0",
    videoRatio: "16 : 9",
    creativityRelevance: 0.5,
    mode: "Professional Mode",
    length: "5s",
    cameraMovement: "Camera Movement",
    likes: 13812
  },
  {
    id: 17,
    src: "assets/videos/High_Quality_16x9_Inside_shot__close_up__a_Chinese.mp4",
    prompt: "extreme close-up with a shallow depth of field of a puddle in a street reflecting a busy futuristic Tokyo city with bright neon signs, night, lens flare",
    modelVersion: "KLING1.0",
    videoRatio: "16 : 9",
    creativityRelevance: 0.5,
    mode: "Professional Mode",
    length: "5s",
    cameraMovement: "Camera Movement",
    likes: 13812
  },
  {
    id: 18,
    src: "assets/videos/High_Quality_16x9_Neon_lights__ambient_light__a_sp.mp4",
    prompt: "extreme close-up with a shallow depth of field of a puddle in a street reflecting a busy futuristic Tokyo city with bright neon signs, night, lens flare",
    modelVersion: "KLING1.0",
    videoRatio: "16 : 9",
    creativityRelevance: 0.5,
    mode: "Professional Mode",
    length: "5s",
    cameraMovement: "Camera Movement",
    likes: 13812
  },
  {
    id: 19,
    src: "assets/videos/High_Quality_16x9_On_an_alien_planet__a_cyberpunk_.mp4",
    prompt: "extreme close-up with a shallow depth of field of a puddle in a street reflecting a busy futuristic Tokyo city with bright neon signs, night, lens flare",
    modelVersion: "KLING1.0",
    videoRatio: "16 : 9",
    creativityRelevance: 0.5,
    mode: "Professional Mode",
    length: "5s",
    cameraMovement: "Camera Movement",
    likes: 13812
  },
  {
    id: 20,
    src: "assets/videos/High_Quality_16x9_The_space_fighter_flies_through_.mp4",
    prompt: "extreme close-up with a shallow depth of field of a puddle in a street reflecting a busy futuristic Tokyo city with bright neon signs, night, lens flare",
    modelVersion: "KLING1.0",
    videoRatio: "16 : 9",
    creativityRelevance: 0.5,
    mode: "Professional Mode",
    length: "5s",
    cameraMovement: "Camera Movement",
    likes: 13812
  },
  {
    id: 21,
    src: "assets/videos/High_Quality_16x9_There_is_a_huge_mirror_pyramid_i.mp4",
    prompt: "extreme close-up with a shallow depth of field of a puddle in a street reflecting a busy futuristic Tokyo city with bright neon signs, night, lens flare",
    modelVersion: "KLING1.0",
    videoRatio: "16 : 9",
    creativityRelevance: 0.5,
    mode: "Professional Mode",
    length: "5s",
    cameraMovement: "Camera Movement",
    likes: 13812
  },
  {
    id: 22,
    src: "assets/videos/High_Quality_Beautiful_Chinese_model_filming_.mp4",
    prompt: "extreme close-up with a shallow depth of field of a puddle in a street reflecting a busy futuristic Tokyo city with bright neon signs, night, lens flare",
    modelVersion: "KLING1.0",
    videoRatio: "16 : 9",
    creativityRelevance: 0.5,
    mode: "Professional Mode",
    length: "5s",
    cameraMovement: "Camera Movement",
    likes: 13812
  },
  {
    id: 23,
    src: "assets/videos/High_Quality_Detailed_shot_of_the_Temple_of_H.mp4",
    prompt: "extreme close-up with a shallow depth of field of a puddle in a street reflecting a busy futuristic Tokyo city with bright neon signs, night, lens flare",
    modelVersion: "KLING1.0",
    videoRatio: "16 : 9",
    creativityRelevance: 0.5,
    mode: "Professional Mode",
    length: "5s",
    cameraMovement: "Camera Movement",
    likes: 13812
  },
  {
    id: 24,
    src: "assets/videos/High_Quality_Dog_swimming__water_ripples_spre.mp4",
    prompt: "extreme close-up with a shallow depth of field of a puddle in a street reflecting a busy futuristic Tokyo city with bright neon signs, night, lens flare",
    modelVersion: "KLING1.0",
    videoRatio: "16 : 9",
    creativityRelevance: 0.5,
    mode: "Professional Mode",
    length: "5s",
    cameraMovement: "Camera Movement",
    likes: 13812
  },
  {
    id: 25,
    src: "assets/videos/High_Quality_The_horse_lowers_its_head_to_eat.mp4",
    prompt: "extreme close-up with a shallow depth of field of a puddle in a street reflecting a busy futuristic Tokyo city with bright neon signs, night, lens flare",
    modelVersion: "KLING1.0",
    videoRatio: "16 : 9",
    creativityRelevance: 0.5,
    mode: "Professional Mode",
    length: "5s",
    cameraMovement: "Camera Movement",
    likes: 13812
  },
]

interface VideoModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  initialVideoId: number;
}

export default function VideoModal({ isOpen, setIsOpen, initialVideoId }: VideoModalProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)

  useEffect(() => {
    const index = videos.findIndex(v => v.id === initialVideoId)
    if (index !== -1) {
      setCurrentVideoIndex(index)
    }
  }, [initialVideoId])

  const currentVideo = videos[currentVideoIndex]

  const nextVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length)
  }

  const prevVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length)
  }

  console.log('Current video src:', currentVideo.src)
  console.log('Current video id:', currentVideo.id)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-6xl p-0 overflow-hidden">
        <DialogHeader className="absolute top-2 right-2 z-10">
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div className="flex h-[80vh]">
          <div className="w-2/3 relative bg-black">
            <video 
              src={currentVideo.src} 
              className="w-full h-full object-cover" 
              autoPlay 
              loop 
              muted 
            />
            <div className="absolute bottom-4 left-4 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
              KLING AI+
            </div>
          </div>
          <div className="w-1/3 bg-gray-900 text-white p-6 overflow-y-auto">
            <DialogTitle className="text-2xl font-bold mb-4">Details</DialogTitle>
            <div className="bg-gray-800 text-green-400 inline-block px-2 py-1 rounded mb-4">Video</div>
            <div className="space-y-4">
              <div>
                <h3 className="text-gray-400">Prompt</h3>
                <p>{currentVideo.prompt}</p>
              </div>
              <div>
                <h3 className="text-gray-400">Model Version</h3>
                <p>{currentVideo.modelVersion}</p>
              </div>
              <div>
                <h3 className="text-gray-400">Video Ratio</h3>
                <p>{currentVideo.videoRatio}</p>
              </div>
              <div>
                <h3 className="text-gray-400">Creativity / Relevance</h3>
                <p>{currentVideo.creativityRelevance}</p>
              </div>
              <div>
                <h3 className="text-gray-400">Mode</h3>
                <p>{currentVideo.mode}</p>
              </div>
              <div>
                <h3 className="text-gray-400">Length</h3>
                <p>{currentVideo.length}</p>
              </div>
              <div>
                <h3 className="text-gray-400">Camera Movement</h3>
                <p>{currentVideo.cameraMovement}</p>
              </div>
            </div>
            <div className="flex justify-between items-center mt-6">
              <Button variant="ghost" className="text-white">
                <Heart className="h-5 w-5 mr-2" />
                {currentVideo.likes}
              </Button>
              <Button variant="ghost" className="text-white">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
              <Button className="bg-green-500 hover:bg-green-600 text-white">
                Clone & Try
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
      <div className="fixed top-1/2 left-4 transform -translate-y-1/2">
        <Button variant="ghost" size="icon" onClick={prevVideo} className="text-white">
          <ChevronLeft className="h-8 w-8" />
        </Button>
      </div>
      <div className="fixed top-1/2 right-4 transform -translate-y-1/2">
        <Button variant="ghost" size="icon" onClick={nextVideo} className="text-white">
          <ChevronRight className="h-8 w-8" />
        </Button>
      </div>
    </Dialog>
  )
}