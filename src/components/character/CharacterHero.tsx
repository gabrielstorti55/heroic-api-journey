
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CharacterHeroProps {
  imageUrl: string;
  isImageNotAvailable: boolean;
}

const CharacterHero: React.FC<CharacterHeroProps> = ({ imageUrl, isImageNotAvailable }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="relative pt-24 md:pt-0">
      {/* Back button for mobile */}
      <div className="md:hidden absolute top-28 left-4 z-20">
        <Link 
          to="/" 
          className="bg-black/50 backdrop-blur-sm text-white p-2 rounded-full"
        >
          <ArrowLeft size={24} />
        </Link>
      </div>
      
      {/* Character image */}
      <div className="h-[40vh] md:h-[60vh] relative overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-marvel-gray animate-pulse-gentle"></div>
        )}
        
        <img
          src={isImageNotAvailable ? '/placeholder.svg' : imageUrl}
          alt="Character Hero"
          className={cn(
            "w-full h-full object-cover transition-opacity duration-500",
            !imageLoaded && "opacity-0",
            imageLoaded && "opacity-100"
          )}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-marvel-black via-marvel-black/50 to-transparent"></div>
      </div>
    </div>
  );
};

export default CharacterHero;
