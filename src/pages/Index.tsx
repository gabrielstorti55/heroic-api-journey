
import React, { useState, useEffect } from 'react';
import { fetchCharacters, MarvelCharacter } from '@/services/marvelAPI';
import CharacterCard from '@/components/CharacterCard';
import SearchBar from '@/components/SearchBar';
import Pagination from '@/components/Pagination';
import LoadingState from '@/components/LoadingState';
import Header from '@/components/Header';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';

const ITEMS_PER_PAGE = 20;

const Index: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get query params
  const queryParams = new URLSearchParams(location.search);
  const initialPage = parseInt(queryParams.get('page') || '1', 10);
  const initialQuery = queryParams.get('query') || '';
  
  const [characters, setCharacters] = useState<MarvelCharacter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalCharacters, setTotalCharacters] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [hasScrolled, setHasScrolled] = useState(false);
  
  // Update URL when page or search query changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) {
      params.set('page', currentPage.toString());
    }
    if (searchQuery) {
      params.set('query', searchQuery);
    }
    
    const newUrl = `${location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    navigate(newUrl, { replace: true });
  }, [currentPage, searchQuery, navigate, location.pathname]);
  
  // Fetch characters
  useEffect(() => {
    const getCharacters = async () => {
      setLoading(true);
      try {
        const offset = (currentPage - 1) * ITEMS_PER_PAGE;
        const response = await fetchCharacters(offset, ITEMS_PER_PAGE, searchQuery);
        
        setCharacters(response.data.results);
        setTotalCharacters(response.data.total);
      } catch (error) {
        console.error('Error fetching characters:', error);
        toast({
          title: "Error",
          description: "Failed to load Marvel characters. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    getCharacters();
  }, [currentPage, searchQuery, toast]);
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };
  
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
        className="relative h-[50vh] min-h-[400px] flex items-center justify-center bg-gradient-to-b from-marvel-black via-marvel-black/90 to-marvel-black"
        style={{
          backgroundImage: 'url("https://terrigen-cdn-dev.marvel.com/content/prod/1x/sre_mas-mp_imgtopper_gradientoverlay_10.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="container px-4 pt-20 text-center relative z-10 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            MARVEL <span className="text-marvel-red">CHARACTERS</span>
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
            Find information about your favorite Marvel characters and discover new ones.
          </p>
          
          <SearchBar onSearch={handleSearch} initialQuery={searchQuery} />
        </div>
      </div>
      
      {/* Characters Grid */}
      <div className="container px-4 py-12">
        {loading ? (
          <LoadingState message="Assembling heroes..." />
        ) : characters.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-fade-in">
              {characters.map(character => (
                <CharacterCard key={character.id} character={character} />
              ))}
            </div>
            
            <Pagination
              totalItems={totalCharacters}
              itemsPerPage={ITEMS_PER_PAGE}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-white mb-4">No characters found</h2>
            <p className="text-white/70 mb-6">Try a different search term or browse all characters.</p>
            <button 
              onClick={() => handleSearch('')}
              className="marvel-button"
            >
              View All Characters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
