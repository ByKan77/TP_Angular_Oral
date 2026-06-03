export interface CharacterRef {
  name: string;
  url: string;
}

export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  image: string;
  origin: CharacterRef;
  location: CharacterRef;
  episode: string[];
  url: string;
}
