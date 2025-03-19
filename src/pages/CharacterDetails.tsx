
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCharacterById, MarvelCharacter } from '@/services/marvelAPI';
import Header from '@/components/Header';
import LoadingState from '@/components/LoadingState';
import { ArrowLeft, Heart, BookOpen, Calendar, Film, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const CharacterDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [character, setCharacter] = useState<MarvelCharacter | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  
  useEffect(() => {
    const getCharacter = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const characterId = parseInt(id, 10);
        const data = await fetchCharacterById(characterId);
        
        if (data) {
          setCharacter(data);
        } else {
          setError('Character not found');
          toast({
            title: "Error",
            description: "Character not found",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error fetching character:', error);
        setError('Failed to load character data');
        toast({
          title: "Error",
          description: "Failed to load character data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    getCharacter();
  }, [id, toast]);
  
  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: `${character?.name} has been ${isFavorite ? "removed from" : "added to"} your favorites`,
    });
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-marvel-black flex items-center justify-center">
        <Header />
        <LoadingState message="Loading character data..." />
      </div>
    );
  }
  
  if (error || !character) {
    return (
      <div className="min-h-screen bg-marvel-black">
        <Header />
        <div className="container px-4 py-24 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Character Not Found</h2>
          <p className="text-white/70 mb-6">
            We couldn't find the character you're looking for.
          </p>
          <Link to="/" className="marvel-button inline-block">
            <ArrowLeft size={16} className="inline mr-2" />
            Back to Characters
          </Link>
        </div>
      </div>
    );
  }
  
  const imageUrl = `${character.thumbnail.path}.${character.thumbnail.extension}`;
  const isImageNotAvailable = character.thumbnail.path.includes('image_not_available');
  
  return (
    <div className="min-h-screen bg-marvel-black pb-20">
      <Header />
      
      {/* Character hero */}
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
            alt={character.name}
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
        
        {/* Character info */}
        <div className="container px-4 relative -mt-32 md:-mt-48 z-10">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Character portrait */}
            <div className="w-full md:w-64 lg:w-80 shrink-0 mx-auto md:mx-0">
              <div className="aspect-square overflow-hidden rounded-lg border-4 border-marvel-red shadow-2xl">
                <img
                  src={isImageNotAvailable ? '/placeholder.svg' : imageUrl}
                  alt={character.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <button
                onClick={handleFavoriteToggle}
                className={cn(
                  "w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all",
                  isFavorite
                    ? "bg-marvel-darkRed text-white"
                    : "bg-marvel-red text-white hover:bg-marvel-darkRed"
                )}
              >
                <Heart className={cn(isFavorite && "fill-white")} size={18} />
                {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              </button>
              
              {/* Back to characters */}
              <Link
                to="/"
                className="w-full mt-4 hidden md:flex items-center justify-center gap-2 py-3 rounded-lg bg-marvel-gray text-white hover:bg-marvel-darkGray transition-all font-medium"
              >
                <ArrowLeft size={18} />
                Back to Characters
              </Link>
            </div>
            
            {/* Character details */}
            <div className="flex-1 animate-slide-up">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{character.name}</h1>
              
              {character.description ? (
                <p className="text-white/80 text-lg mb-8">{character.description}</p>
              ) : (
                <p className="text-white/60 text-lg mb-8 italic">No description available.</p>
              )}
              
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Stat 
                  icon={<BookOpen className="text-marvel-red" size={24} />}
                  label="Comics"
                  value={character.comics.available}
                  items={character.comics.items.slice(0, 3).map(c => c.name)}
                />
                
                <Stat 
                  icon={<Film className="text-marvel-red" size={24} />}
                  label="Series"
                  value={character.series.available}
                  items={character.series.items.slice(0, 3).map(s => s.name)}
                />
              </div>
              
              {/* External links */}
              {character.urls.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-white text-lg font-semibold mb-3">External Links</h3>
                  <div className="flex flex-wrap gap-4">
                    {character.urls.map((url, index) => (
                      <a
                        key={index}
                        href={url.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-marvel-gray hover:bg-marvel-darkGray text-white py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <ExternalLink size={16} />
                        {url.type.charAt(0).toUpperCase() + url.type.slice(1)}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  items: string[];
}

const Stat: React.FC<StatProps> = ({ icon, label, value, items }) => {
  return (
    <div className="glass-card p-4 rounded-lg">
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <h3 className="text-white font-semibold">{label}</h3>
        <div className="ml-auto bg-marvel-red text-white text-sm font-bold px-2 py-1 rounded">
          {value}
        </div>
      </div>
      
      {items.length > 0 ? (
        <ul className="text-white/70">
          {items.map((item, index) => (
            <li key={index} className="truncate">
              • {item}
            </li>
          ))}
          {value > items.length && (
            <li className="text-white/50 italic text-sm mt-1">
              And {value - items.length} more...
            </li>
          )}
        </ul>
      ) : (
        <p className="text-white/50 italic">No {label.toLowerCase()} available</p>
      )}
    </div>
  );
};

export default CharacterDetails;
