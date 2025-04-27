import { MD5 } from 'crypto-js';

export interface MarvelCharacter {
  id: number;
  name: string;
  description: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  comics: {
    available: number;
    items: Array<{
      name: string;
    }>;
  };
  series: {
    available: number;
    items: Array<{
      name: string;
    }>;
  };
  stories: {
    available: number;
    items: Array<{
      name: string;
      type: string;
    }>;
  };
  events: {
    available: number;
    items: Array<{
      name: string;
    }>;
  };
  urls: Array<{
    type: string;
    url: string;
  }>;
}

export interface MarvelApiResponse {
  code: number;
  status: string;
  data: {
    offset: number;
    limit: number;
    total: number;
    count: number;
    results: MarvelCharacter[];
  };
}

// Marvel API credentials
const API_BASE_URL = 'https://gateway.marvel.com/v1/public';
const PUBLIC_KEY = 'fec5b9e955afd364fefb2012d17b38db';
const PRIVATE_KEY = 'f0516e61f8991a915431c7f7b5eab6f6220cfc3d';

// Generate timestamp and hash for Marvel API authentication
const generateAuthParams = (): { ts: number; apiKey: string; hash: string } => {
  const ts = Date.now();
  const hash = MD5(`${ts}${PRIVATE_KEY}${PUBLIC_KEY}`).toString();
  
  return {
    ts,
    apiKey: PUBLIC_KEY,
    hash,
  };
};

// Fetch characters with optional search query and pagination
export const fetchCharacters = async (
  offset: number = 0, 
  limit: number = 20, 
  nameStartsWith?: string
): Promise<{ data: { results: MarvelCharacter[]; total: number } }> => {
  const { ts, apiKey, hash } = generateAuthParams();
  
  const params = new URLSearchParams({
    ts: ts.toString(),
    apiKey,
    hash,
    offset: offset.toString(),
    limit: limit.toString(),
    ...(nameStartsWith && { nameStartsWith }),
  });

  try {
    const response = await fetch(`${API_BASE_URL}/characters?${params}`);
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Marvel API error: ${response.status} - ${errorData}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching Marvel characters:', error);
    throw error;
  }
};

// Fetch a single character by ID
export const fetchCharacterById = async (
  characterId: number
): Promise<MarvelCharacter | null> => {
  const { ts, apiKey, hash } = generateAuthParams();
  
  const params = new URLSearchParams({
    ts: ts.toString(),
    apiKey,
    hash,
  });

  try {
    const response = await fetch(`${API_BASE_URL}/characters/${characterId}?${params}`);
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Marvel API error: ${response.status} - ${errorData}`);
    }
    
    const data = await response.json();
    return data.data.results[0] || null;
  } catch (error) {
    console.error('Error fetching character by ID:', error);
    throw error;
  }
};

// Mock characters for development when API keys are not set
const getMockCharacters = (
  offset = 0,
  limit = 20,
  nameStartsWith?: string
): MarvelApiResponse => {
  const mockCharacters: MarvelCharacter[] = [
    {
      id: 1009220,
      name: "Captain America",
      description: "Vowing to serve his country any way he could, young Steve Rogers took the super soldier serum to become America's one-man army. Fighting for the red, white and blue for over 60 years, Captain America is the living, breathing symbol of freedom and liberty.",
      thumbnail: {
        path: "http://i.annihil.us/u/prod/marvel/i/mg/3/50/537ba56d31087",
        extension: "jpg"
      },
      comics: { available: 2015, items: [{ name: "Captain America Comics (1941) #1" }] },
      series: { available: 518, items: [{ name: "Captain America (2018 - Present)" }] },
      stories: { available: 3063, items: [{ name: "Cover #3063", type: "cover" }] },
      events: { available: 31, items: [{ name: "Acts of Vengeance!" }] },
      urls: [{ type: "detail", url: "http://marvel.com/characters/8/captain_america" }]
    },
    {
      id: 1009368,
      name: "Iron Man",
      description: "Wounded, captured and forced to build a weapon by his enemies, billionaire industrialist Tony Stark instead created an advanced suit of armor to save his life and escape captivity. Now with a new outlook on life, Tony uses his money and intelligence to make the world a safer, better place as Iron Man.",
      thumbnail: {
        path: "http://i.annihil.us/u/prod/marvel/i/mg/9/c0/527bb7b37ff55",
        extension: "jpg"
      },
      comics: { available: 2607, items: [{ name: "Iron Man (1968) #1" }] },
      series: { available: 617, items: [{ name: "Iron Man (2020 - Present)" }] },
      stories: { available: 3880, items: [{ name: "Cover #3880", type: "cover" }] },
      events: { available: 31, items: [{ name: "Acts of Vengeance!" }] },
      urls: [{ type: "detail", url: "http://marvel.com/characters/29/iron_man" }]
    },
    {
      id: 1009351,
      name: "Hulk",
      description: "Caught in a gamma bomb explosion while trying to save the life of a teenager, Dr. Bruce Banner was transformed into the incredibly powerful creature called the Hulk. An all too often misunderstood hero, the angrier the Hulk gets, the stronger the Hulk gets.",
      thumbnail: {
        path: "http://i.annihil.us/u/prod/marvel/i/mg/5/a0/538615ca33ab0",
        extension: "jpg"
      },
      comics: { available: 1720, items: [{ name: "Incredible Hulk (1962) #1" }] },
      series: { available: 515, items: [{ name: "Immortal Hulk (2018 - Present)" }] },
      stories: { available: 2605, items: [{ name: "Cover #2605", type: "cover" }] },
      events: { available: 26, items: [{ name: "Age of Ultron" }] },
      urls: [{ type: "detail", url: "http://marvel.com/characters/25/hulk" }]
    },
    {
      id: 1009664,
      name: "Thor",
      description: "As the son of Odin, king of Asgard, Thor grew up in a realm where battle was a way of life. After many years, his arrogance forced his father to banish him to Earth. While here, Thor learned humility and helped protect humanity from all manner of threats.",
      thumbnail: {
        path: "http://i.annihil.us/u/prod/marvel/i/mg/d/d0/5269657a74350",
        extension: "jpg"
      },
      comics: { available: 1820, items: [{ name: "Thor (1966) #1" }] },
      series: { available: 506, items: [{ name: "Thor (2020 - Present)" }] },
      stories: { available: 2782, items: [{ name: "Cover #2782", type: "cover" }] },
      events: { available: 27, items: [{ name: "Acts of Vengeance!" }] },
      urls: [{ type: "detail", url: "http://marvel.com/characters/1166/thor" }]
    },
    {
      id: 1009189,
      name: "Black Widow",
      description: "Trained as a spy and an assassin, Natasha Romanoff, also known as Black Widow, has changed sides from villain to hero many times over the years.",
      thumbnail: {
        path: "http://i.annihil.us/u/prod/marvel/i/mg/f/30/50fecad1f395b",
        extension: "jpg"
      },
      comics: { available: 1112, items: [{ name: "Black Widow (2020) #1" }] },
      series: { available: 266, items: [{ name: "Black Widow (2020 - Present)" }] },
      stories: { available: 1661, items: [{ name: "Cover #1661", type: "cover" }] },
      events: { available: 19, items: [{ name: "Age of X" }] },
      urls: [{ type: "detail", url: "http://marvel.com/characters/6/black_widow" }]
    },
    {
      id: 1009610,
      name: "Spider-Man",
      description: "Bitten by a radioactive spider, high school student Peter Parker gained the speed, strength and powers of a spider. Adopting the name Spider-Man, Peter hoped to start a career using his new abilities. Taught that with great power comes great responsibility, Spidey has vowed to use his powers to help people.",
      thumbnail: {
        path: "http://i.annihil.us/u/prod/marvel/i/mg/3/50/526548a343e4b",
        extension: "jpg"
      },
      comics: { available: 4227, items: [{ name: "Amazing Spider-Man (1963) #1" }] },
      series: { available: 1017, items: [{ name: "Amazing Spider-Man (2018 - Present)" }] },
      stories: { available: 6134, items: [{ name: "Cover #6134", type: "cover" }] },
      events: { available: 38, items: [{ name: "Acts of Vengeance!" }] },
      urls: [{ type: "detail", url: "http://marvel.com/characters/54/spider-man" }]
    },
    {
      id: 1009652,
      name: "Thanos",
      description: "The Mad Titan Thanos, a melancholy, brooding individual, consumed with the concept of death, sought out personal power and increased strength, endowing himself with cybernetic implants until he became more powerful than any of his brethren.",
      thumbnail: {
        path: "http://i.annihil.us/u/prod/marvel/i/mg/6/40/5274137e3e2cd",
        extension: "jpg"
      },
      comics: { available: 495, items: [{ name: "Thanos (2019) #1" }] },
      series: { available: 190, items: [{ name: "Thanos (2019 - Present)" }] },
      stories: { available: 645, items: [{ name: "Cover #645", type: "cover" }] },
      events: { available: 8, items: [{ name: "Annihilation" }] },
      urls: [{ type: "detail", url: "http://marvel.com/characters/58/thanos" }]
    },
    {
      id: 1009268,
      name: "Deadpool",
      description: "Wade Wilson is a former mercenary and test subject of the Weapon X Program, where he received his regenerative healing factor through the scientific experiments conducted on him.",
      thumbnail: {
        path: "http://i.annihil.us/u/prod/marvel/i/mg/9/90/5261a86cacb99",
        extension: "jpg"
      },
      comics: { available: 969, items: [{ name: "Deadpool (2019) #1" }] },
      series: { available: 234, items: [{ name: "Deadpool (2019 - Present)" }] },
      stories: { available: 1424, items: [{ name: "Cover #1424", type: "cover" }] },
      events: { available: 20, items: [{ name: "Age of Apocalypse" }] },
      urls: [{ type: "detail", url: "http://marvel.com/characters/12/deadpool" }]
    },
    {
      id: 1009697,
      name: "Vision",
      description: "The metal monstrosity called Ultron created the synthetic humanoid known as the Vision to use against Ultron's creator, Dr. Henry Pym and Pym's teammates in the Avengers. However, Vision served the Avengers faithfully.",
      thumbnail: {
        path: "http://i.annihil.us/u/prod/marvel/i/mg/9/d0/5111527040594",
        extension: "jpg"
      },
      comics: { available: 495, items: [{ name: "Vision (2016) #1" }] },
      series: { available: 151, items: [{ name: "Vision (2016 - Present)" }] },
      stories: { available: 716, items: [{ name: "Cover #716", type: "cover" }] },
      events: { available: 9, items: [{ name: "Acts of Vengeance!" }] },
      urls: [{ type: "detail", url: "http://marvel.com/characters/2447/vision" }]
    },
    {
      id: 1009282,
      name: "Doctor Strange",
      description: "As Earth's Sorcerer Supreme, Doctor Strange wields arcane spells and mystical artifacts to defend the planet against malevolent threats.",
      thumbnail: {
        path: "http://i.annihil.us/u/prod/marvel/i/mg/5/f0/5261a85a501fe",
        extension: "jpg"
      },
      comics: { available: 925, items: [{ name: "Doctor Strange (2018) #1" }] },
      series: { available: 267, items: [{ name: "Doctor Strange (2018 - Present)" }] },
      stories: { available: 1347, items: [{ name: "Cover #1347", type: "cover" }] },
      events: { available: 17, items: [{ name: "Acts of Vengeance!" }] },
      urls: [{ type: "detail", url: "http://marvel.com/characters/14/doctor_strange" }]
    }
  ];

  // Filter by name if specified
  let filteredCharacters = [...mockCharacters];
  if (nameStartsWith && nameStartsWith.trim() !== '') {
    const searchTerm = nameStartsWith.toLowerCase();
    filteredCharacters = mockCharacters.filter(char => 
      char.name.toLowerCase().startsWith(searchTerm)
    );
  }
  
  // Apply pagination
  const paginatedCharacters = filteredCharacters.slice(offset, offset + limit);
  
  return {
    code: 200,
    status: "Ok",
    data: {
      offset,
      limit,
      total: filteredCharacters.length,
      count: paginatedCharacters.length,
      results: paginatedCharacters,
    },
  };
};
