
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-lg mx-auto">
      <div 
        className={cn(
          "relative flex items-center bg-marvel-darkGray border transition-all duration-300 rounded-full overflow-hidden",
          isFocused 
            ? "border-marvel-red shadow-lg shadow-marvel-red/20" 
            : "border-marvel-gray"
        )}
      >
        <input
          type="text"
          placeholder="Buscar personagens Marvel..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full py-3 px-6 bg-transparent text-white focus:outline-none"
        />
        
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-14 text-gray-400 hover:text-white transition-colors"
            aria-label="Limpar busca"
          >
            <X size={18} />
          </button>
        )}
        
        <button
          type="submit"
          className="bg-marvel-red h-full px-5 text-white transition-colors hover:bg-marvel-darkRed"
          aria-label="Buscar"
        >
          <Search size={20} />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
