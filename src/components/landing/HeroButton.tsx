import React from 'react';

interface ButtonProps {
  onClick?: () => void;
}

const HeroButton: React.FC<ButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative px-6 py-3 font-bold text-white rounded-full overflow-hidden group"
    >
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500 via-blue-500 via-green-500 to-orange-500 animate-gradient-x"></span>
      <span className="relative">Create your AI videos</span>
    </button>
  );
};

export default HeroButton;

