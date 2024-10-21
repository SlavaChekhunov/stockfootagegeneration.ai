'use client'

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Play, ChevronDown, Upload, Smartphone, Monitor} from 'lucide-react'
import { useState, useCallback,useEffect } from 'react'
import { useDropzone, FileRejection } from 'react-dropzone';
import { useTokens } from '@/contexts/TokenContext';

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import TextToClipTab from './TextToClipTab';
import GenerateButton from "./GenerateButton"
import { Video } from '../types/Video'; 
import { toast } from "react-toastify"
import Image from "next/image"

type StorageValue = string | number | boolean | object | null;

const saveToLocalStorage = (key: string, value: StorageValue): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

const loadFromLocalStorage = <T extends StorageValue>(key: string, defaultValue: T): T => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(key);
    if (stored !== null) {
      try {
        return JSON.parse(stored) as T;
      } catch {
        // If parsing fails, return the default value
        return defaultValue;
      }
    }
  }
  return defaultValue;
};



const VideoGenerationUI: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'text-to-video' | 'image-to-video' | 'text-to-clip'>(() => 
    loadFromLocalStorage('activeTab', 'text-to-video')
  );
  const [prompt, setPrompt] = useState<string>(() => loadFromLocalStorage('prompt', ''));
  const [negativePrompt, setNegativePrompt] = useState<string>(() => loadFromLocalStorage('negativePrompt', ''));
  const [image, setImage] = useState<File | string | null>(() => loadFromLocalStorage('image', null));
  const [aspectRatio, setAspectRatio] = useState<string>(() => loadFromLocalStorage('aspectRatio', '16:9'));
  // const [status, setStatus] = useState<string>(() => loadFromLocalStorage('status', ''));
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedVideoType, setSelectedVideoType] = useState('All Videos');
  // const [image, setImage] = useState<File | string | null>(null);
  const [isSoundOn, setIsSoundOn] = useState(false);
  // const [videoStatus, setVideoStatus] = useState('');
  // const [audioStatus, setAudioStatus] = useState('');
  // const [aspectRatio, setAspectRatio] = useState('16:9');

  const [songDescription, setSongDescription] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isInstrumental, setIsInstrumental] = useState(false);
  const [secondAudioFile, setSecondAudioFile] = useState<File | null>(null);
  const [useSecondAudio, setUseSecondAudio] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generationPhase, setGenerationPhase] = useState<'idle' | 'submitting' | 'generating'>('idle');

  const [useEndFrame, setUseEndFrame] = useState(false);
  const [endFrame, setEndFrame] = useState<File | null>(null);

  // Text to Clip specific state
  const [textToClipImage, setTextToClipImage] = useState<File | null>(null);
  const [textToClipEndFrame, setTextToClipEndFrame] = useState<File | null>(null);
  const [useTextToClipEndFrame, setUseTextToClipEndFrame] = useState(false);

  const [userVideos, setUserVideos] = useState<Video[]>([]);
  // const [imageS3Url, setImageS3Url] = useState<string | undefined>(undefined);

  
  const updatePrompt = (value: string) => {
    setPrompt(value);
    saveToLocalStorage('prompt', value);
  };
  
  const updateNegativePrompt = (value: string) => {
    setNegativePrompt(value);
    saveToLocalStorage('negativePrompt', value);
  };

  // const updateStatus = (value: string) => {
  //   setStatus(value);
  //   saveToLocalStorage('status', value);
  // };
  
  const updateImage = (value: File | string | null) => {
    setImage(value);
    if (value instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        saveToLocalStorage('image', reader.result);
      };
      reader.readAsDataURL(value);
    } else {
      saveToLocalStorage('image', value);
    }
  };

  const { refreshTokens } = useTokens();

  // const GENERATION_TIME = 452; 
  // const PROGRESS_INTERVAL = 2500; 
  const MAX_IMAGE_SIZE = 10 * 1024 * 1024

  const onDropImage = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (acceptedFiles.length > 0) {
      // setImage(acceptedFiles[0]);
      updateImage(acceptedFiles[0]);
    } else if (fileRejections.length > 0) {
      console.error('File rejected:', fileRejections[0].errors);
      // You might want to set an error state here to display to the user
    }
  }, []);

  const onDropEndFrame = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (acceptedFiles.length > 0) {
      setEndFrame(acceptedFiles[0]);
    } else if (fileRejections.length > 0) {
      console.error('End frame file rejected:', fileRejections[0].errors);
      // You might want to set an error state here to display to the user
    }
  }, []);

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps, isDragActive: isImageDragActive } = useDropzone({
    onDrop: onDropImage,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxSize: MAX_IMAGE_SIZE,
    multiple: false,
  });

  const { getRootProps: getEndFrameRootProps, getInputProps: getEndFrameInputProps, isDragActive: isEndFrameDragActive } = useDropzone({
    onDrop: onDropEndFrame,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxSize: MAX_IMAGE_SIZE,
    multiple: false,
  });

  const handleVideoSelect = async (video: Video) => {
    setVideoUrl(video.url || '');
    if (video.sourceType === 'IMAGE' && video.sourceImageUrl) {
      setImage(video.sourceImageUrl);
    } else {
      setImage(null);
    }

     // Update the prompt
    setPrompt(video.prompt || '');
  };

  const renderTextToVideoTab = () => (
    <>
        <div className="mb-4 relative">
      <div className="flex justify-between items-center mb-2">
        <label htmlFor="prompt" className="block text-sm font-medium">
          Prompt
        </label>
        <div className="flex items-center space-x-2">
          <Switch
            id="sound-toggle"
            checked={isSoundOn}
            onCheckedChange={setIsSoundOn}
          />
          <label htmlFor="sound-toggle" className="text-sm">Sound {isSoundOn ? 'On' : 'Off'}</label>
        </div>
      </div>
        <Textarea
          id="prompt"
          className="w-full h-32 bg-gray-800 border border-gray-700 rounded p-2 text-white pr-16"
          placeholder="Got a vision? Let's bring it to life. Type away or explore the Clip Craft AI Best Practices"
          value={prompt}
          onChange={(e) => updatePrompt(e.target.value)}
          maxLength={2500}
        />
        <span className="absolute bottom-2 right-2 text-sm text-gray-400">
          {prompt.length} / 2500
        </span>
      </div>

      <div className="mb-6">
      <label className="block text-sm mb-6 text-gray-300">Video Format:</label>
      <RadioGroup value={aspectRatio} onValueChange={setAspectRatio} className="flex space-x-6">
        <TooltipProvider>
          <div className="flex flex-col items-center">
            <RadioGroupItem value="16:9" id="16:9" className="sr-only peer" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Label
                  htmlFor="16:9"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Monitor className={`w-8 h-8 ${aspectRatio === '16:9' ? 'text-blue-400' : 'text-gray-400'}`} />
                  <span className="text-xs mt-1 text-gray-400">16:9</span>
                </Label>
              </TooltipTrigger>
              <TooltipContent>
                <p>Horizontal/Long form</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex flex-col items-center">
            <RadioGroupItem value="9:16" id="9:16" className="sr-only peer" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Label
                  htmlFor="9:16"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Smartphone className={`w-8 h-8 ${aspectRatio === '9:16' ? 'text-blue-400' : 'text-gray-400'}`} />
                  <span className="text-xs mt-1 text-gray-400">9:16</span>
                </Label>
              </TooltipTrigger>
              <TooltipContent>
                <p>TikTok/Youtube Shorts</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </RadioGroup>
    </div>


      <div className="mb-4 relative">
        <label htmlFor="negative-prompt" className="block text-sm font-medium mb-1">
          Negative Prompt
        </label>
        <Textarea
          id="negative-prompt"
          className="w-full h-32 bg-gray-800 border border-gray-700 rounded p-2 text-white pr-16"
          placeholder="List the types of content you don't want to see in the video. Examples: blur, distortion, disfigurement, low quality, grainy, warped, pixelated, unclear, morphing, deformed, ugly."
          value={negativePrompt}
          onChange={(e) => updateNegativePrompt(e.target.value)}
          maxLength={2500}
        />
        <span className="absolute bottom-2 right-2 text-sm text-gray-400">
          {negativePrompt.length} / 2500
        </span>
      </div>
    </>
  );

  const renderImageToVideoTab = () => (
    <>
      <div className="mb-4 flex justify-between items-center">
        <Label htmlFor="use-end-frame" className="text-sm font-medium">Image and Prompt</Label>
        <div className="flex items-center space-x-2">
          <Switch
            id="use-end-frame"
            checked={useEndFrame}
            onCheckedChange={setUseEndFrame}
          />
          <Label htmlFor="use-end-frame">Add End Frame</Label>
        </div>
      </div>
      <div className={`mb-4 ${useEndFrame ? 'grid grid-cols-2 gap-4' : ''}`}>
  <div 
    {...(image ? {} : getImageRootProps())} 
    className={`w-full h-48 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer overflow-hidden
      ${image ? 'border-gray-300 cursor-default' : isImageDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
  >
    <input {...getImageInputProps()} disabled={!!image} />
    {image ? (
      <div className="flex items-center w-full h-full">
        <div className="w-1/2 h-full flex items-center justify-center">
          <div className="relative w-full h-full">
            <Image
              src={image instanceof File ? URL.createObjectURL(image) : image}
              alt="Selected image"
              layout="fill"
              objectFit="cover"
              className="rounded-l-lg"
            />
          </div>
        </div>
        <div className="w-1/2 h-full flex flex-row items-center justify-between px-4">
        <p className="truncate text-center flex-grow mr-4">{image instanceof File ? image.name : 'Selected Image'}</p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setImage(null);
          }}
          className="text-red-500 hover:text-red-700 flex-shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      </div>
    ) : (
      <div className="text-center">
        <Upload className="mx-auto mb-2" size={32} />
        <p className="text-sm">Click / Drop / Paste</p>
        <p className="text-xs text-gray-500">Select from History</p>
      </div>
    )}
  </div>
        {useEndFrame && (
          <div 
            {...getEndFrameRootProps()} 
            className={`w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer
              ${isEndFrameDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
          >
            <input {...getEndFrameInputProps()} />
            {endFrame ? (
              <p>{endFrame.name}</p>
            ) : (
              <div className="text-center">
                <Upload className="mx-auto mb-2" size={24} />
                <p className="text-sm">Click / Drop / Paste</p>
                <p className="text-xs text-gray-500">Select from History</p>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="mb-4 relative">
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="prompt" className="block text-sm font-medium">
            Prompt (Optional)
          </label>
          <div className="flex items-center space-x-2">
            <Switch
              id="sound-toggle"
              checked={isSoundOn}
              onCheckedChange={setIsSoundOn}
            />
            <label htmlFor="sound-toggle" className="text-sm">Sound {isSoundOn ? 'On' : 'Off'}</label>
          </div>
        </div>
        <Textarea
          id="prompt"
          className="w-full h-32 bg-gray-800 border border-gray-700 rounded p-2 text-white pr-16"
          placeholder="Got a vision? Let's bring it to life. Type away or explore the Clip Craft AI Best Practices"
          value={prompt}
          onChange={(e) => updatePrompt(e.target.value)}
          maxLength={2500}
        />
        <span className="absolute bottom-2 right-2 text-sm text-gray-400">
          {prompt.length} / 2500
        </span>
      </div>
      <div className="mb-4 relative">
        <label htmlFor="negativePrompt" className="block text-sm font-medium mb-2">
          Negative Prompt (Optional)
        </label>
        <Textarea
          id="negativePrompt"
          className="w-full h-32 bg-gray-800 border border-gray-700 rounded p-2 text-white pr-16"
          placeholder="List the types of content you don't want to see in the video."
          value={negativePrompt}
          onChange={(e) => updateNegativePrompt(e.target.value)}
          maxLength={1000}
        />
        <span className="absolute bottom-2 right-2 text-sm text-gray-400">
          {negativePrompt.length} / 1000
        </span>
      </div>
    </>
  );

  // Add this new function to handle token refunds
  const refundTokens = async (tokensToRefund: number) => {
    const response = await fetch('/api/refund-tokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tokensToRefund }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to refund tokens');
    }

    await refreshTokens(); // Refresh the token count after refund
  };

  const handleSubmit = async () => {
      // Clear previous video and reset states
      setVideoUrl('');
      setIsGenerating(true);
      setProgress(0);
      setGenerationPhase('submitting');
    // setStatus('');
    // updateStatus('PENDING');

     // Clear localStorage
    localStorage.clear();
  
    const startTime = Date.now();
    const GENERATION_TIME = 452000;
    const TOKENS_TO_DEDUCT = 50;  
  
    try {
      console.log('Deducting tokens');
      // Deduct tokens
      const deductResponse = await fetch('/api/deduct-tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokensToDeduct: TOKENS_TO_DEDUCT }),
      });
  
      if (!deductResponse.ok) {
        const errorData = await deductResponse.json();
        throw new Error(errorData.message || 'Failed to deduct tokens');
      }
  
      await refreshTokens();
  
      console.log('Preparing form data');
      const formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('aspect_ratio', aspectRatio);
      formData.append('activeTab', activeTab);
      if (image instanceof File) {
        console.log('Appending image file:', image.name);
        formData.append('imageUrl', image);
      } else if (typeof image === 'string') {
        console.log('Appending image URL:', image);
        formData.append('imageUrl', image);
      }
      formData.append('negative_prompt', negativePrompt);
      formData.append('useEndFrame', useEndFrame.toString());
      formData.append('isSoundOn', isSoundOn.toString());
      formData.append('songDescription', songDescription || '');
  
      console.log('Sending request to start-video-generation');
      const response = await fetch('/api/start-video-generation', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to start video generation');
      }
  
      const { videoId } = await response.json();
      console.log('Received videoId:', videoId);
      setGenerationPhase('generating');

      // Start progress simulation
      const progressInterval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const newProgress = Math.min(Math.floor((elapsedTime / GENERATION_TIME) * 99), 99);
        setProgress(newProgress);
      }, 1000);

      console.log('Starting to poll generation status');
      await pollGenerationStatus(videoId, progressInterval, TOKENS_TO_DEDUCT);

  
    } catch (error) {
      console.error('Error generating video:', error);
      toast.error(`Error generating video: ${(error as Error).message}`);
      // Refund tokens if the error occurred after deduction
      try {
        await refundTokens(TOKENS_TO_DEDUCT);
      } catch (refundError) {
        console.error('Error refunding tokens:', refundError);
      }
    } finally {
      setIsGenerating(false);
    }
  };
  
  

  const pollGenerationStatus = async (videoId: string, progressInterval: NodeJS.Timeout, tokensToRefund: number) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/check-video-status?id=${videoId}`);
        if (!response.ok) {
          throw new Error('Failed to check generation status');
        }
  
        const data = await response.json();
  
        if (data.status === 'SUCCESS') {
          clearInterval(pollInterval);
          clearInterval(progressInterval);
          setVideoUrl(data.url);
          setProgress(100);
          setIsGenerating(false);
          await fetchUserVideos();
  
          // Clear localStorage and reset state
          localStorage.clear();
          setPrompt('');
          setNegativePrompt('');
          setImage(null);
          setAspectRatio('16:9');
  
          toast.success('Video generated successfully!');
          
        } else if (data.status === 'FAILED') {
          clearInterval(pollInterval);
          clearInterval(progressInterval);
          setIsGenerating(false);
          toast.error('Video generation failed');
  
          // Refund tokens
          try {
            await refundTokens(tokensToRefund);
            toast.info(`${tokensToRefund} tokens have been refunded due to the failed generation.`);
          } catch (refundError) {
            console.error('Error refunding tokens:', refundError);
          }
        } else {
          // Still in progress
        }
      } catch (error) {
        clearInterval(pollInterval);
        clearInterval(progressInterval);
        console.error('Error checking generation status:', error);
        setIsGenerating(false);
  
        // Refund tokens in case of error
        try {
          await refundTokens(tokensToRefund);
          toast.info(`${tokensToRefund} tokens have been refunded due to the error.`);
        } catch (refundError) {
          console.error('Error refunding tokens:', refundError);
        }
      }
    }, 5000);
  };


  // Add this function inside your component
  const fetchUserVideos = async (filter: string = 'All Videos') => {
    try {
      const response = await fetch(`/api/getUserVideos?filter=${encodeURIComponent(filter)}`);
      if (response.ok) {
        const videos = await response.json();
        setUserVideos(videos);
      } else {
        console.error('Failed to fetch user videos');
      }
    } catch (error) {
      console.error('Error fetching user videos:', error);
    }
  };

  useEffect(() => {
    fetchUserVideos(selectedVideoType);
    
    const savedImage = loadFromLocalStorage<string | null>('image', null);
    if (savedImage && typeof savedImage === 'string' && savedImage.startsWith('data:')) {
      fetch(savedImage)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "image.png", { type: "image/png" });
          setImage(file);
        });
    }
  }, [selectedVideoType]);

  // useEffect(() => {
  //   const fetchInitialStatus = async () => {
  //     try {
  //       const response = await fetch('/api/get-latest-video-status');
  //       if (response.ok) {
  //         const data = await response.json();
  //         if (data.status === 'SUCCESS') {
  //           // Clear localStorage and reset state
  //           localStorage.clear();
  //           setPrompt('');
  //           setNegativePrompt('');
  //           setImage(null);
  //           setAspectRatio('16:9');
  //           setVideoUrl(data.url);
  //         } else {
  //           // Load from localStorage only if the latest video is not successful
  //           setPrompt(loadFromLocalStorage('prompt', ''));
  //           setNegativePrompt(loadFromLocalStorage('negativePrompt', ''));
  //           setImage(loadFromLocalStorage('image', null));
  //           setAspectRatio(loadFromLocalStorage('aspectRatio', '16:9'));
  //         }
  //       }
  //     } catch (error) {
  //       console.error('Error fetching initial video status:', error);
  //     }
  //   };
  
  //   fetchInitialStatus();
  // }, []);

// useEffect(() => {
//   console.log('imageS3Url updated:', imageS3Url);
// }, [imageS3Url]);


// const saveVideoToDatabase = async (url: string, sourceImageUrl: string | undefined) => {
//   try {
//     console.log('Saving video to database with sourceImageUrl:', sourceImageUrl); // Add this line

//     // First, save the video to S3
//     const saveToS3Response = await fetch('/api/save-video-to-s3', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ videoUrl: url }),
//     });

//     if (!saveToS3Response.ok) {
//       throw new Error('Failed to save video to S3');
//     }

//     const { s3Url } = await saveToS3Response.json();
//     console.log('Video saved to S3:', s3Url);

//     const isImageToVideo = activeTab === 'image-to-video';

//     const requestBody = {
//       name: `Video ${new Date().toISOString()}`,
//       prompt,
//       aspectRatio,
//       url: s3Url,
//       status: 'SUCCESS',
//       sourceType: isImageToVideo ? 'IMAGE' : 'TEXT',
//       sourceImageUrl,
//     };

//     console.log('Request body for saving to database:', requestBody); // Add this line

//     const response = await fetch('/api/getUserVideos', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(requestBody),
//     });

//     if (response.ok) {
//       const savedVideo = await response.json();
//       console.log('Video saved to database:', savedVideo);
//       setUserVideos(prevVideos => [savedVideo, ...prevVideos]);
//     } else {
//       throw new Error('Failed to save video');
//     }
//   } catch (error: unknown) {
//     console.error('Error saving video to database:', error);
//     toast.error(`Error saving video: ${(error as Error).message}`);
//   }
// };

const handleVideoTypeChange = (type: string) => {
  setSelectedVideoType(type);
  fetchUserVideos(type);
};


return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
    {/* Left Panel */}
    <div className="w-1/4 p-6 border-r border-gray-700">
        <div className="mb-6 flex flex-wrap">
          <Button
            variant="ghost"
            className={`mr-4 pb-2 ${activeTab === 'text-to-video' ? 'border-b-2 border-blue-400' : ''}`}
            onClick={() => setActiveTab('text-to-video')}
          >
            Text to Video
          </Button>
          <Button
            variant="ghost"
            className={`mr-4 pb-2 ${activeTab === 'image-to-video' ? 'border-b-2 border-blue-400' : ''}`}
            onClick={() => setActiveTab('image-to-video')}
          >
            Image to Video
          </Button>
          <Button
            variant="ghost"
            className={`pb-2 ${activeTab === 'text-to-clip' ? 'border-b-2 border-blue-400' : ''}`}
            onClick={() => setActiveTab('text-to-clip')}
          >
            Image to Clip
          </Button>
        </div>
        {activeTab === 'text-to-video' && renderTextToVideoTab()}
        {activeTab === 'image-to-video' && renderImageToVideoTab()}
        {activeTab === 'text-to-clip' && (
          <TextToClipTab
            prompt={prompt}
            setPrompt={setPrompt}
            songDescription={songDescription}
            setSongDescription={setSongDescription}
            audioFile={audioFile}
            setAudioFile={setAudioFile}
            isInstrumental={isInstrumental}
            setIsInstrumental={setIsInstrumental}
            secondAudioFile={secondAudioFile}
            setSecondAudioFile={setSecondAudioFile}
            useSecondAudio={useSecondAudio}
            setUseSecondAudio={setUseSecondAudio}
            image={textToClipImage}
            setImage={setTextToClipImage}
            endFrame={textToClipEndFrame}
            setEndFrame={setTextToClipEndFrame}
            useEndFrame={useTextToClipEndFrame}
            setUseEndFrame={setUseTextToClipEndFrame}
            negativePrompt={negativePrompt}
            setNegativePrompt={setNegativePrompt}
          />
        )}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full">
              <GenerateButton
                  activeTab={activeTab}
                  prompt={prompt}
                  image={image}
                  audioFile={audioFile}
                  handleSubmit={handleSubmit}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{(prompt.trim() || image) ? 'Generate video' : 'Prompt or image required'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {/* <p className="mt-4 text-sm text-gray-400">{status}</p> */}
      </div>
    
    {/* Middle Section */}
    <div className="flex-1 p-6 flex items-center justify-start relative">
  <div className="w-[90%] flex items-center justify-center">
  {videoUrl ? (
  <div className="w-full h-full flex items-center justify-center">
    <video 
      src={videoUrl}
      autoPlay
      muted={!isSoundOn}
      playsInline
      loop
      preload="none"
      controls
      className="max-w-[70vh] max-h-[70vh] rounded-[30px] object-cover"
    >
      Your browser does not support the video tag.
    </video>
  </div>
) : isGenerating || progress > 0? (
  <div className="w-full max-w-3xl"> 
    <div className="w-full aspect-video border-2 border-gray-700 rounded-[30px] flex flex-col items-center justify-center p-8">
      <div className="flex items-center w-full">
        <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden relative mr-4">
          <div 
            className="h-full bg-cyan-400 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm text-cyan-400 font-semibold">
          {progress}%
        </span>
      </div>
      <p className="text-center text-sm text-zinc-400 mt-4">
        {progress === 100
          ? "Video generated successfully! It will appear shortly."
          : generationPhase === 'submitting' 
            ? "Submitting prompt..."
            : "Your creation is brewing! Enjoy a coffee break while we finalize it."}
      </p>
    </div>
  </div>
) : (
  <div className="text-center">
    <Play className="mx-auto mb-4" size={48} />
    <p>Unlock your creative potential and experience the magic of Clip Craft AI right now!</p>
  </div>
)}
  </div>
</div>

   {/* Right Panel */}
    <div className='fixed right-4 top-20 bottom-4 bg-gray-800 rounded-lg shadow-lg transition-all duration-300 ease-in-out overflow-hidden'>
      
      <div className="h-full overflow-hidden">
        <div className="h-full p-4 overflow-y-auto scrollbar-hide">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-between mb-4">
                {selectedVideoType} <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleVideoTypeChange('All Videos')}>All Videos</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleVideoTypeChange('Text to video')}>Text to video</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleVideoTypeChange('Image to video')}>Image to video</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="space-y-4">
            {userVideos.map((video) => (
              <div key={video.id} className="bg-gray-700 rounded-lg overflow-hidden relative">
                <video
                  src={video.url}
                  className="w-full h-32 object-cover"
                  onClick={() => handleVideoSelect(video)}
                />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded">
                  {video.aspectRatio}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default VideoGenerationUI;