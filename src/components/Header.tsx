
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface HeaderProps {
  transparent?: boolean;
}

const Header: React.FC<HeaderProps> = ({ transparent = false }) => {
  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      transparent 
        ? "bg-transparent" 
        : "bg-black/80 backdrop-blur-md shadow-lg"
    )}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-4">
          <div className="relative overflow-hidden rounded-full border-2 border-marvel-red p-1 bg-white">
            <img 
              src="/lovable-uploads/608694bd-9b56-440c-8b3f-5f52477ecc27.png" 
              alt="Marvel API"
              className="w-10 h-10 object-cover" 
            />
          </div>
          <h1 className="text-2xl font-bold tracking-wider text-white">MARVEL <span className="text-marvel-red">CHARACTERS</span></h1>
        </Link>
        
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link 
                to="/" 
                className="text-white opacity-80 hover:opacity-100 transition-opacity font-medium"
              >
                CHARACTERS
              </Link>
            </li>
            <li>
              <Link 
                to="/favorites" 
                className="text-white opacity-80 hover:opacity-100 transition-opacity font-medium"
              >
                FAVORITES
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
