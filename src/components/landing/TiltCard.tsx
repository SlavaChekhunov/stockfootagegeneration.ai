'use client'
import React, { useState } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  position: 'left' | 'center' | 'right';
}

const TiltCard: React.FC<TiltCardProps> = ({ children, position }) => {
  const [tiltStyle, setTiltStyle] = useState({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (position === 'center') return;

    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const y = e.clientY - rect.top;

    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = position === 'left' ? 15 : -15;

    setTiltStyle({ transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)` });
  };

  const handleMouseLeave = () => {
    setTiltStyle({});
  };

  const baseClasses = "w-full h-full transition-all duration-300 ease-out";
  const positionClasses = {
    left: "transform rotate-y-15 hover:rotate-y-0",
    center: "hover:scale-105",
    right: "transform -rotate-y-15 hover:rotate-y-0"
  };

  return (
    <div className={`relative w-70 h-60 perspective-1000 ${positionClasses[position]}`}>
      <div
        className={`${baseClasses} ${position !== 'center' ? 'transform-style-3d' : ''}`}
        style={tiltStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
    </div>
  );
};

export default TiltCard;