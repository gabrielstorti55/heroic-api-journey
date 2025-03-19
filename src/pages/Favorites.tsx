
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Favorites: React.FC = () => {
  const { toast } = useToast();
  const [hasScrolled, setHasScrolled] = useState(false);
  
  // Header transparency effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setHasScrolled(scrollPosition > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-marvel-black pb-20">
      <Header transparent={!hasScrolled} />
      
      {/* Hero Section */}
      <div 
        className="relative h-[40vh] min-h-[300px] flex items-center justify-center bg-gradient-to-b from-marvel-black via-marvel-black/90 to-marvel-black"
        style={{
          backgroundImage: 'url("https://terrigen-cdn-dev.marvel.com/content/prod/1x/sre_mas-mp_imgtopper_gradientoverlay_10.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="container px-4 pt-20 text-center relative z-10 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            YOUR <span className="text-marvel-red">FAVORITES</span>
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            This is where your favorite Marvel characters will be saved.
          </p>
        </div>
      </div>
      
      {/* Empty State */}
      <div className="container px-4 py-16 text-center">
        <div className="glass-card max-w-2xl mx-auto p-10 rounded-2xl animate-scale-in">
          <div className="w-20 h-20 mx-auto bg-marvel-darkGray rounded-full flex items-center justify-center mb-6">
            <Heart className="w-10 h-10 text-marvel-red" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4">No Favorites Yet</h2>
          <p className="text-white/70 mb-8">
            To add characters to your favorites, browse the character listing and click the heart icon or the "Add to Favorites" button on character details.
          </p>
          
          <Link to="/" className="marvel-button inline-block">
            Browse Characters
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Favorites;
