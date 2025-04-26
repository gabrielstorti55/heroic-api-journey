
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCharacterById, MarvelCharacter } from '@/services/marvelAPI';
import Header from '@/components/Header';
import LoadingState from '@/components/LoadingState';
import { ArrowLeft, Heart } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import CharacterStats from '@/components/character/CharacterStats';
import CharacterExternalLinks from '@/components/character/CharacterExternalLinks';
import CharacterHero from '@/components/character/CharacterHero';
import { isFavorite, toggleFavorite } from '@/services/favoritesService';

const CharacterDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [character, setCharacter] = useState<MarvelCharacter | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFav, setIsFav] = useState<boolean>(false);
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
          setIsFav(isFavorite(characterId));
        } else {
          setError('Personagem não encontrado');
          toast({
            title: "Erro",
            description: "Personagem não encontrado",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Erro ao carregar dados do personagem:', error);
        setError('Falha ao carregar dados do personagem. Por favor, tente novamente.');
        toast({
          title: "Erro",
          description: "Falha ao carregar dados do personagem. Por favor, tente novamente.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    getCharacter();
  }, [id, toast]);
  
  const handleFavoriteToggle = () => {
    if (character) {
      const newState = toggleFavorite(character.id);
      setIsFav(newState);
      toast({
        title: newState ? "Adicionado aos favoritos" : "Removido dos favoritos",
        description: `${character.name} foi ${newState ? "adicionado aos" : "removido dos"} seus favoritos`,
      });
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-marvel-black flex items-center justify-center">
        <Header />
        <LoadingState message="Carregando dados do personagem..." />
      </div>
    );
  }
  
  if (error || !character) {
    return (
      <div className="min-h-screen bg-marvel-black">
        <Header />
        <div className="container px-4 py-24 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Personagem Não Encontrado</h2>
          <p className="text-white/70 mb-6">
            Não conseguimos encontrar o personagem que você está procurando.
          </p>
          <Link to="/" className="marvel-button inline-block">
            <ArrowLeft size={16} className="inline mr-2" />
            Voltar para Personagens
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
      
      <CharacterHero 
        imageUrl={imageUrl}
        isImageNotAvailable={isImageNotAvailable}
      />
      
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
                isFav
                  ? "bg-marvel-darkRed text-white"
                  : "bg-marvel-red text-white hover:bg-marvel-darkRed"
              )}
            >
              <Heart className={cn(isFav && "fill-white")} size={18} />
              {isFav ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
            </button>
            
            {/* Back to characters */}
            <Link
              to="/"
              className="w-full mt-4 hidden md:flex items-center justify-center gap-2 py-3 rounded-lg bg-marvel-gray text-white hover:bg-marvel-darkGray transition-all font-medium"
            >
              <ArrowLeft size={18} />
              Voltar para Personagens
            </Link>
          </div>
          
          {/* Character details */}
          <div className="flex-1 animate-slide-up">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{character.name}</h1>
            
            {character.description ? (
              <p className="text-white/80 text-lg mb-8">{character.description}</p>
            ) : (
              <p className="text-white/60 text-lg mb-8 italic">Nenhuma descrição disponível.</p>
            )}
            
            <CharacterStats 
              comics={character.comics}
              series={character.series}
            />
            
            <CharacterExternalLinks urls={character.urls} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterDetails;
