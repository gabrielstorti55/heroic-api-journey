
import React from 'react';
import { BookOpen, Film } from 'lucide-react';

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
              E {value - items.length} mais...
            </li>
          )}
        </ul>
      ) : (
        <p className="text-white/50 italic">Nenhuma {label.toLowerCase()} disponível</p>
      )}
    </div>
  );
};

interface CharacterStatsProps {
  comics: {
    available: number;
    items: Array<{ name: string }>;
  };
  series: {
    available: number;
    items: Array<{ name: string }>;
  };
}

const CharacterStats: React.FC<CharacterStatsProps> = ({ comics, series }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Stat 
        icon={<BookOpen className="text-marvel-red" size={24} />}
        label="Quadrinhos"
        value={comics.available}
        items={comics.items.slice(0, 3).map(c => c.name)}
      />
      <Stat 
        icon={<Film className="text-marvel-red" size={24} />}
        label="Séries"
        value={series.available}
        items={series.items.slice(0, 3).map(s => s.name)}
      />
    </div>
  );
};

export default CharacterStats;
