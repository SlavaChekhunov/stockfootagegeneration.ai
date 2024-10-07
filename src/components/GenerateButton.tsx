import React from 'react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Play } from 'lucide-react';

const GenerateButton: React.FC<{
  activeTab: string;
  prompt: string;
  image: File | string |null;
  audioFile: File | null;
  handleSubmit: () => void;
}> = ({ activeTab, prompt, image, audioFile, handleSubmit }) => {
  const isDisabled = () => {
    switch (activeTab) {
      case 'text-to-video':
        return !prompt.trim();
      case 'image-to-video':
        return !image;
      case 'text-to-clip':
        return !prompt.trim() || !audioFile;
      default:
        return true;
    }
  };

  const getTooltipContent = () => {
    switch (activeTab) {
      case 'text-to-video':
        return prompt.trim() ? 'Generate video' : 'Prompt required';
      case 'image-to-video':
        return image ? 'Generate video' : 'Image required';
      case 'text-to-clip':
        return prompt.trim() && audioFile ? 'Generate video' : 'Prompt and audio file required';
      default:
        return 'Select a tab and provide input';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-full">
            <Button 
              className={`mt-4 w-full font-bold text-white rounded-full overflow-hidden group relative px-6 py-3 
                ${!isDisabled() ? 'bg-gradient-to-r from-purple-500 via-blue-500 via-green-500 to-orange-500' : 'bg-gray-500'}`}
              onClick={handleSubmit}
              disabled={isDisabled()}
            >
              <span className={`absolute inset-0 w-full h-full ${!isDisabled() ? 'animate-gradient-x' : ''}`}></span>
              <span className="relative flex items-center justify-center">
                <Play className="mr-2" size={16} />
                Generate (~4m32s)
              </span>
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipContent()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default GenerateButton;