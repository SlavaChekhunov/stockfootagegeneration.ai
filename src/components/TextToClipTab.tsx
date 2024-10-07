import React, { useCallback, useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TextToClipTabProps {
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  negativePrompt: string;
  setNegativePrompt: React.Dispatch<React.SetStateAction<string>>;
  songDescription: string;
  setSongDescription: React.Dispatch<React.SetStateAction<string>>;
  audioFile: File | null;
  setAudioFile: React.Dispatch<React.SetStateAction<File | null>>;
  isInstrumental: boolean;
  setIsInstrumental: React.Dispatch<React.SetStateAction<boolean>>;
  secondAudioFile: File | null;
  setSecondAudioFile: React.Dispatch<React.SetStateAction<File | null>>;
  useSecondAudio: boolean;
  setUseSecondAudio: React.Dispatch<React.SetStateAction<boolean>>;
  image: File | null;
  setImage: React.Dispatch<React.SetStateAction<File | null>>;
  endFrame: File | null;
  setEndFrame: React.Dispatch<React.SetStateAction<File | null>>;
  useEndFrame: boolean;
  setUseEndFrame: React.Dispatch<React.SetStateAction<boolean>>;
}

const MAX_AUDIO_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

const TextToClipTab: React.FC<TextToClipTabProps> = ({
  prompt,
  setPrompt,
  negativePrompt,
  setNegativePrompt,
  songDescription,
  setSongDescription,
  audioFile,
  setAudioFile,
  isInstrumental,
  setIsInstrumental,
  secondAudioFile,
  setSecondAudioFile,
  useSecondAudio,
  setUseSecondAudio,
  image,
  setImage,
  endFrame,
  setEndFrame,
  useEndFrame,
  setUseEndFrame
}) => {
  const [isAudioUploaded, setIsAudioUploaded] = useState(false);

  const onDropAudio = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setAudioFile(acceptedFiles[0]);
      setIsAudioUploaded(true);
      setSongDescription('');
    }
  }, [setAudioFile, setSongDescription]);

  const onDropSecondAudio = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSecondAudioFile(acceptedFiles[0]);
    }
  }, [setSecondAudioFile]);

  const onDropImage = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setImage(acceptedFiles[0]);
    }
  }, [setImage]);

  const onDropEndFrame = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setEndFrame(acceptedFiles[0]);
    }
  }, [setEndFrame]);

  const { getRootProps: getAudioRootProps, getInputProps: getAudioInputProps, isDragActive: isAudioDragActive } = useDropzone({
    onDrop: onDropAudio,
    accept: {
      'audio/mpeg': ['.mp3'],
      'audio/mp4': ['.mp4', '.m4a'],
    },
    maxSize: MAX_AUDIO_SIZE,
    multiple: false,
    disabled: !!songDescription,
  });

  const { getRootProps: getSecondAudioRootProps, getInputProps: getSecondAudioInputProps, isDragActive: isSecondAudioDragActive } = useDropzone({
    onDrop: onDropSecondAudio,
    accept: {
      'audio/mpeg': ['.mp3'],
      'audio/mp4': ['.mp4', '.m4a'],
    },
    maxSize: MAX_AUDIO_SIZE,
    multiple: false,
    disabled: !!songDescription,
  });

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

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <Label htmlFor="use-end-frame" className="text-sm font-medium">Image and End Frame</Label>
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
          {...getImageRootProps()} 
          className={`w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer
            ${isImageDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
        >
          <input {...getImageInputProps()} />
          {image ? (
            <p>{image.name}</p>
          ) : (
            <div className="text-center">
              <Upload className="mx-auto mb-2" size={24} />
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
        <label htmlFor="prompt" className="block text-sm font-medium mb-2">
          Prompt
        </label>
        <Textarea
          id="prompt"
          className="w-full h-32 bg-gray-800 border border-gray-700 rounded p-2 text-white pr-16"
          placeholder="Got a vision? Let's bring it to life. Type away or explore the KLING AI Best Practices"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          maxLength={2500}
        />
        <span className="absolute bottom-2 right-2 text-sm text-gray-400">
          {prompt.length} / 2500
        </span>
      </div>

      <div className="mb-4 relative">
        <label htmlFor="negative-prompt" className="block text-sm font-medium mb-2">
          Negative Prompt
        </label>
        <Textarea
          id="negative-prompt"
          className="w-full h-32 bg-gray-800 border border-gray-700 rounded p-2 text-white pr-16"
          placeholder="List the types of content you don't want to see in the video. Examples: blur, distortion, disfigurement, low quality, grainy, warped, pixelated, unclear, morphing, deformed, ugly."
          value={negativePrompt}
          onChange={(e) => setNegativePrompt(e.target.value)}
          maxLength={2500}
        />
        <span className="absolute bottom-2 right-2 text-sm text-gray-400">
          {negativePrompt.length} / 2500
        </span>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <Label htmlFor="use-second-audio" className="text-sm font-medium">Audio Files</Label>
        <div className="flex items-center space-x-2">
          <Switch
            id="use-second-audio"
            checked={useSecondAudio}
            onCheckedChange={setUseSecondAudio}
          />
          <Label htmlFor="use-second-audio">Add Second Audio</Label>
        </div>
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`mb-4 ${useSecondAudio ? 'grid grid-cols-2 gap-4' : ''}`}>
              <div 
                {...getAudioRootProps()} 
                className={`w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer
                  ${isAudioDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                  ${songDescription ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input {...getAudioInputProps()} />
                {audioFile ? (
                  <p>{audioFile.name}</p>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto mb-2" size={24} />
                    <p className="text-sm">Click / Drop / Paste audio file (MP3 or MP4)</p>
                    <p className="text-xs text-gray-500">Max size: 50MB</p>
                  </div>
                )}
              </div>
              {useSecondAudio && (
                <div 
                  {...getSecondAudioRootProps()} 
                  className={`w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer
                    ${isSecondAudioDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                    ${songDescription ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <input {...getSecondAudioInputProps()} />
                  {secondAudioFile ? (
                    <p>{secondAudioFile.name}</p>
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto mb-2" size={24} />
                      <p className="text-sm">Click / Drop / Paste second audio file (MP3 or MP4)</p>
                      <p className="text-xs text-gray-500">Max size: 50MB</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TooltipTrigger>
          {songDescription && (
            <TooltipContent>
              <p>You cannot upload files while generating music</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      <div className="mb-4 relative">
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="songDescription" className="block text-sm font-medium">
            Song Description
          </label>
          <div className="flex items-center space-x-2">
            <Switch
              id="instrumental-toggle"
              checked={isInstrumental}
              onCheckedChange={setIsInstrumental}
              disabled={isAudioUploaded}
            />
            <label htmlFor="instrumental-toggle" className="text-sm">Instrumental {isInstrumental}</label>
          </div>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Textarea
                  id="songDescription"
                  className={`w-full h-24 bg-gray-800 border border-gray-700 rounded p-2 text-white
                    ${isAudioUploaded ? 'opacity-50 cursor-not-allowed' : ''}`}
                  placeholder="Describe the song or provide additional context"
                  value={songDescription}
                  onChange={(e) => {
                    setSongDescription(e.target.value);
                    if (e.target.value) {
                      setAudioFile(null);
                      setSecondAudioFile(null);
                      setIsAudioUploaded(false);
                    }
                  }}
                  maxLength={1000}
                  disabled={isAudioUploaded}
                />
              </div>
            </TooltipTrigger>
            {isAudioUploaded && (
              <TooltipContent>
                <p>You cannot generate audio when you uploaded your own files</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </>
  );
};

export default TextToClipTab;