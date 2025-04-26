
import { MarvelCharacter } from './marvelAPI';

// Chave para armazenar favoritos no localStorage
const FAVORITES_KEY = 'marvel_favorites';

// Obter favoritos do localStorage
export const getFavorites = (): number[] => {
  const favoritesJson = localStorage.getItem(FAVORITES_KEY);
  return favoritesJson ? JSON.parse(favoritesJson) : [];
};

// Verificar se um personagem está nos favoritos
export const isFavorite = (characterId: number): boolean => {
  const favorites = getFavorites();
  return favorites.includes(characterId);
};

// Adicionar um personagem aos favoritos
export const addFavorite = (characterId: number): void => {
  const favorites = getFavorites();
  if (!favorites.includes(characterId)) {
    favorites.push(characterId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
};

// Remover um personagem dos favoritos
export const removeFavorite = (characterId: number): void => {
  const favorites = getFavorites();
  const updatedFavorites = favorites.filter(id => id !== characterId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
};

// Toggle de favorito (adicionar/remover)
export const toggleFavorite = (characterId: number): boolean => {
  const isFav = isFavorite(characterId);
  if (isFav) {
    removeFavorite(characterId);
  } else {
    addFavorite(characterId);
  }
  return !isFav;
};

// Obter todos os personagens favoritados
export const getFavoriteCharacters = (allCharacters: MarvelCharacter[]): MarvelCharacter[] => {
  const favoriteIds = getFavorites();
  return allCharacters.filter(character => favoriteIds.includes(character.id));
};
