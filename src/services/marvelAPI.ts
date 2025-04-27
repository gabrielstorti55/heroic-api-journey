import { MD5 } from 'crypto-js';

// Interfaces para o retorno da API
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
    items: Array<{ name: string }>;
  };
  series: {
    available: number;
    items: Array<{ name: string }>;
  };
  stories: {
    available: number;
    items: Array<{ name: string; type: string }>;
  };
  events: {
    available: number;
    items: Array<{ name: string }>;
  };
  urls: Array<{ type: string; url: string }>;
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

// Chaves da API Marvel
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

// Função mock para simular personagens
const getMockCharacters = (
  offset = 0,
  limit = 20,
  nameStartsWith?: string
): MarvelApiResponse => {
  const allCharacters: MarvelCharacter[] = [
    {
      id: 1009220,
      name: "Captain America",
      description: "Vowing to serve his country any way he could, young Steve Rogers took the super soldier serum to become America's one-man army.",
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
      description: "Billionaire industrialist Tony Stark created an advanced suit of armor to save his life and escape captivity.",
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
      description: "Caught in a gamma bomb explosion, Dr. Bruce Banner became the Hulk, a powerful but misunderstood hero.",
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
      id: 1009618,
      name: "Scarlet Witch",
      description: "Wanda Maximoff, known as the Scarlet Witch, is a powerful mutant who can manipulate reality itself using chaos magic. She is a long-time member of the Avengers and a key figure in many Marvel storylines.",
      thumbnail: {
        path: "http://i.annihil.us/u/prod/marvel/i/mg/1/03/526548a343e4b",
        extension: "jpg"
      },
      comics: { available: 850, items: [{ name: "Scarlet Witch (2015) #1" }] },
      series: { available: 200, items: [{ name: "Scarlet Witch (2015 - 2017)" }] },
      stories: { available: 1200, items: [{ name: "Story #1200", type: "story" }] },
      events: { available: 15, items: [{ name: "House of M" }] },
      urls: [{ type: "detail", url: "http://marvel.com/characters/12/scarlet_witch" }]
    },
    {
      id: 1009718,
      name: "Doctor Strange",
      description: "Stephen Strange was a brilliant but arrogant neurosurgeon. After a car accident severely damaged his hands, he sought out the Ancient One and became the Sorcerer Supreme, protector of Earth against magical and mystical threats.",
      thumbnail: {
        path: "http://i.annihil.us/u/prod/marvel/i/mg/c/e0/535fedb6ec137",
        extension: "jpg"
      },
      comics: { available: 1200, items: [{ name: "Doctor Strange (1968) #1" }] },
      series: { available: 300, items: [{ name: "Doctor Strange (2015 - 2018)" }] },
      stories: { available: 2100, items: [{ name: "Story #2100", type: "story" }] },
      events: { available: 18, items: [{ name: "Infinity War" }] },
      urls: [{ type: "detail", url: "http://marvel.com/characters/11/doctor_strange" }]
    },
    {
      id: 1010338,
      name: "Groot",
      description: "Groot is a sentient, tree-like creature and a member of the Guardians of the Galaxy. He is known for his limited but expressive vocabulary and his powerful regenerative abilities.",
      thumbnail: {
        path: "http://i.annihil.us/u/prod/marvel/i/mg/9/00/537ba57ee9938",
        extension: "jpg"
      },
      comics: { available: 300, items: [{ name: "Guardians of the Galaxy (2013) #1" }] },
      series: { available: 100, items: [{ name: "Guardians of the Galaxy (2013 - 2015)" }] },
      stories: { available: 400, items: [{ name: "Story #400", type: "story" }] },
      events: { available: 10, items: [{ name: "Annihilation: Conquest" }] },
      urls: [{ type: "detail", url: "http://marvel.com/characters/1010338/groot" }]
    },
    {
      id: 1010744,
      name: "Rocket Raccoon",
      description: "Rocket Raccoon is a genetically modified raccoon with exceptional marksmanship and tactical skills. He is a key member of the Guardians of the Galaxy, known for his sharp wit and engineering prowess.",
      thumbnail: {
        path: "http://i.annihil.us/u/prod/marvel/i/mg/8/c0/5202887448860",
        extension: "jpg"
      },
      comics: { available: 400, items: [{ name: "Rocket Raccoon (2014) #1" }] },
      series: { available: 120, items: [{ name: "Rocket Raccoon (2014 - 2015)" }] },
      stories: { available: 500, items: [{ name: "Story #500", type: "story" }] },
      events: { available: 12, items: [{ name: "Annihilation: Conquest" }] },
      urls: [{ type: "detail", url: "http://marvel.com/characters/1010744/rocket_raccoon" }]
    },
    {
      id: 1010733,
      name: "Star-Lord",
      description: "Peter Quill, known as Star-Lord, is the half-human, half-alien leader of the Guardians of the Galaxy. Armed with his element guns and sense of humor, he defends the galaxy against cosmic threats.",
      thumbnail: {
        path: "http://i.annihil.us/u/prod/marvel/i/mg/c/60/4c0035c8a54c7",
        extension: "jpg"
      },
      comics: { available: 550, items: [{ name: "Legendary Star-Lord (2014) #1" }] },
      series: { available: 150, items: [{ name: "Guardians of the Galaxy (2013 - 2015)" }] },
      stories: { available: 700, items: [{ name: "Story #700", type: "story" }] },
      events: { available: 14, items: [{ name: "Infinity Countdown" }] },
      urls: [{ type: "detail", url: "http://marvel.com/characters/1010733/star-lord" }]
    },
    {
      id: 1010846,
      name: "Ant-Man",
      description: "Scott Lang, known as Ant-Man, is a master thief who becomes a hero with the ability to shrink to the size of an ant while retaining his strength. He fights alongside the Avengers and is a key member of the Marvel Universe.",
      thumbnail: {
        path: "http://i.annihil.us/u/prod/marvel/i/mg/7/60/5204c9b57b65f",
        extension: "jpg"
      },
      comics: { available: 600, items: [{ name: "Ant-Man (2015) #1" }] },
      series: { available: 150, items: [{ name: "Ant-Man (2015)" }] },
      stories: { available: 700, items: [{ name: "Story #700", type: "story" }] },
      events: { available: 8, items: [{ name: "Infinity War" }] },
      urls: [{ type: "detail", url: "http://marvel.com/characters/1010846/ant-man" }]
    },
    {
      id: 1009285,
      name: "Wasp",
      description: "Hope van Dyne, also known as Wasp, is a brilliant scientist and the daughter of Hank Pym and Janet van Dyne. She possesses the ability to shrink to the size of an insect while retaining superhuman strength, and is a skilled fighter and tactician.",
      thumbnail: {
        path: "http://i.annihil.us/u/prod/marvel/i/mg/4/c0/537bafc0acb7a",
        extension: "jpg"
      },
      comics: { available: 250, items: [{ name: "Wasp (2016) #1" }] },
      series: { available: 80, items: [{ name: "Wasp (2016)" }] },
      stories: { available: 350, items: [{ name: "Story #350", type: "story" }] },
      events: { available: 10, items: [{ name: "Secret Wars" }] },
      urls: [{ type: "detail", url: "http://marvel.com/characters/1009285/wasp" }]
    },
    {
      id: 1009610,
      name: "Hawkeye",
      description: "Clint Barton, known as Hawkeye, is a highly skilled marksman and a member of the Avengers. Despite not having superhuman abilities, his precision with a bow and arrow and his tactical skills make him a valuable hero.",
      thumbnail: {
        path: "http://i.annihil.us/u/prod/marvel/i/mg/f/30/535c524b7a68d",
        extension: "jpg"
      },
      comics: { available: 700, items: [{ name: "Hawkeye (2012) #1" }] },
      series: { available: 250, items: [{ name: "Hawkeye (2012 - 2015)" }] },
      stories: { available: 900, items: [{ name: "Story #900", type: "story" }] },
      events: { available: 13, items: [{ name: "Age of Ultron" }] },
      urls: [{ type: "detail", url: "http://marvel.com/characters/1009610/hawkeye" }]
    },
    {
      id: 1009710,
      name: "Wolverine",
      description: "James Howlett, better known as Wolverine, is a mutant with enhanced senses, strength, and an accelerated healing factor. His claws are made of indestructible adamantium, making him one of the most dangerous and enduring characters in the Marvel Universe.",
      thumbnail: {
        path: "http://i.annihil.us/u/prod/marvel/i/mg/c/30/5361d8c9337de",
        extension: "jpg"
      },
      comics: { available: 2200, items: [{ name: "Wolverine (1988) #1" }] },
      series: { available: 350, items: [{ name: "Wolverine (2010)" }] },
      stories: { available: 2900, items: [{ name: "Story #2900", type: "story" }] },
      events: { available: 20, items: [{ name: "X-Men: Days of Future Past" }] },
      urls: [{ type: "detail", url: "http://marvel.com/characters/1009710/wolverine" }]
    },
    {
      id: 1009823,
      name: "Jean Grey",
      description: "Jean Grey is one of the original X-Men and a powerful telepath with the ability to read minds and manipulate thoughts. As the host of the Phoenix Force, her powers are further amplified, making her one of the most powerful mutants in existence.",
      thumbnail: {
        path: "http://i.annihil.us/u/prod/marvel/i/mg/5/80/52631d4a42d58",
        extension: "jpg"
      },
      comics: { available: 1200, items: [{ name: "X-Men (1963) #1" }] },
      series: { available: 300, items: [{ name: "X-Men: Phoenix (2004)" }] },
      stories: { available: 1500, items: [{ name: "Story #1500", type: "story" }] },
      events: { available: 15, items: [{ name: "The Phoenix Saga" }] },
      urls: [{ type: "detail", url: "http://marvel.com/characters/1009823/jean_grey" }]
    },
    {
      id: 1009468,
      name: "Cyclops",
      description: "Scott Summers, known as Cyclops, is a founding member of the X-Men. He has the ability to shoot powerful beams from his eyes, which can only be controlled by special ruby-quartz lenses. As a natural leader, Cyclops is often seen leading the X-Men in battle.",
      thumbnail: {
        path: "http://i.annihil.us/u/prod/marvel/i/mg/1/d0/534c6db983d8b",
        extension: "jpg"
      },
      comics: { available: 1300, items: [{ name: "X-Men (1963) #1" }] },
      series: { available: 280, items: [{ name: "X-Men (2010)" }] },
      stories: { available: 1700, items: [{ name: "Story #1700", type: "story" }] },
      events: { available: 18, items: [{ name: "X-Cutioner's Song" }] },
      urls: [{ type: "detail", url: "http://marvel.com/characters/1009468/cyclops" }]
    }
    
    
  ];

  let filteredCharacters = allCharacters;

  if (nameStartsWith) {
    const searchTerm = nameStartsWith.toLowerCase();
    filteredCharacters = allCharacters.filter(character =>
      character.name.toLowerCase().startsWith(searchTerm)
    );
  }

  return {
    code: 200,
    status: "Ok",
    data: {
      offset,
      limit,
      total: filteredCharacters.length,
      count: Math.min(limit, filteredCharacters.length),
      results: filteredCharacters.slice(offset, offset + limit),
    },
  };
};
