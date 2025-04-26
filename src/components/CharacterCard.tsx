
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MarvelCharacter } from '@/services/marvelAPI';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { isFavorite, toggleFavorite } from '@/services/favoritesService';
import { useToast } from '@/components/ui/use-toast';

interface CharacterCardProps {
  character: MarvelCharacter;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const { toast } = useToast();
  
  // Get image URL
  const imageUrl = `${character.thumbnail.path}.${character.thumbnail.extension}`;
  const isImageNotAvailable = character.thumbnail.path.includes('image_not_available');
  
  // Verificar se o personagem está nos favoritos ao carregar
  useEffect(() => {
    setIsFav(isFavorite(character.id));
  }, [character.id]);
  
  // Handle favorite toggle
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newState = toggleFavorite(character.id);
    setIsFav(newState);
    
    // Mostrar notificação
    toast({
      title: newState ? "Adicionado aos favoritos" : "Removido dos favoritos",
      description: `${character.name} foi ${newState ? "adicionado aos" : "removido dos"} seus favoritos`,
    });
  };

  return (
    <Link to={`/character/${character.id}`} className="block">
      <div className="marvel-card h-80 group">
        {/* Loading placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-marvel-gray animate-pulse-gentle flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-marvel-red border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* Character image */}
        <div className="w-full h-64 overflow-hidden">
          <img
            src={isImageNotAvailable ? '/placeholder.svg' : imageUrl}
            alt={character.name}
            className={cn(
              "w-full h-full object-cover transition-all duration-500 group-hover:scale-110",
              !imageLoaded && "opacity-0",
              imageLoaded && "opacity-100"
            )}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        
        {/* Favorite button */}
        <button 
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-marvel-red"
          onClick={handleFavoriteToggle}
          aria-label={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Heart 
            className={cn(
              "w-5 h-5 transition-all duration-300",
              isFav ? "fill-white text-white" : "text-white"
            )} 
          />
        </button>
        
        {/* Character name */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <h3 className="text-white font-bold text-lg truncate">{character.name}</h3>
        </div>
        
        {/* Details button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button className="marvel-button w-full">Detalhes</button>
        </div>
      </div>
    </Link>
  );
};

export default CharacterCard;
