
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { getFavorites } from '@/services/favoritesService';
import { fetchCharacterById, MarvelCharacter } from '@/services/marvelAPI';
import CharacterCard from '@/components/CharacterCard';
import LoadingState from '@/components/LoadingState';

const Favorites: React.FC = () => {
  const { toast } = useToast();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [favoriteCharacters, setFavoriteCharacters] = useState<MarvelCharacter[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setHasScrolled(scrollPosition > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadFavoriteCharacters = async () => {
      setLoading(true);
      const favoriteIds = getFavorites();
      
      if (favoriteIds.length === 0) {
        setLoading(false);
        return;
      }
      
      try {
        const charactersPromises = favoriteIds.map(id => fetchCharacterById(id));
        const characters = await Promise.all(charactersPromises);
        
        // Filtrar personagens nulos (que podem ocorrer em caso de erro)
        const validCharacters = characters.filter(Boolean) as MarvelCharacter[];
        setFavoriteCharacters(validCharacters);
      } catch (error) {
        console.error('Erro ao carregar personagens favoritos:', error);
        toast({
          title: "Erro",
          description: "Falha ao carregar personagens favoritos.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadFavoriteCharacters();
  }, [toast]);

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
            SEUS <span className="text-marvel-red">FAVORITOS</span>
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Aqui é onde seus personagens favoritos da Marvel serão salvos.
          </p>
        </div>
      </div>
      
      {loading ? (
        <div className="container px-4 py-16 text-center">
          <LoadingState message="Carregando personagens favoritos..." />
        </div>
      ) : favoriteCharacters.length === 0 ? (
        // Empty State
        <div className="container px-4 py-16 text-center">
          <div className="glass-card max-w-2xl mx-auto p-10 rounded-2xl animate-scale-in">
            <div className="w-20 h-20 mx-auto bg-marvel-darkGray rounded-full flex items-center justify-center mb-6">
              <Heart className="w-10 h-10 text-marvel-red" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Nenhum Favorito Ainda</h2>
            <p className="text-white/70 mb-8">
              Para adicionar personagens aos favoritos, navegue pela lista de personagens e clique no ícone de coração ou no botão "Adicionar aos Favoritos" nos detalhes do personagem.
            </p>
            
            <Link to="/" className="marvel-button inline-block">
              Explorar Personagens
            </Link>
          </div>
        </div>
      ) : (
        // Favorite Characters Grid
        <div className="container px-4 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favoriteCharacters.map(character => (
              <CharacterCard key={character.id} character={character} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;
