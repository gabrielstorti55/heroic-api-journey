
import React from 'react';
import { ExternalLink } from 'lucide-react';

interface CharacterExternalLinksProps {
  urls: Array<{
    type: string;
    url: string;
  }>;
}

const CharacterExternalLinks: React.FC<CharacterExternalLinksProps> = ({ urls }) => {
  if (urls.length === 0) return null;

  const getLabel = (type: string): string => {
    switch (type) {
      case 'detail':
        return 'Detalhes';
      case 'wiki':
        return 'Wiki';
      case 'comiclink':
        return 'Quadrinhos';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-white text-lg font-semibold mb-3">Links Externos</h3>
      <div className="flex flex-wrap gap-4">
        {urls.map((url, index) => (
          <a
            key={index}
            href={url.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-marvel-gray hover:bg-marvel-darkGray text-white py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
          >
            <ExternalLink size={16} />
            {getLabel(url.type)}
          </a>
        ))}
      </div>
    </div>
  );
};

export default CharacterExternalLinks;
