interface PokemonStatus {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

interface Pokemon {
  id: number;
  name: string;
  imageUrl: string;
  type1: string;
  type2: string;
  description: string;
  status: PokemonStatus;
}

export type { PokemonStatus, Pokemon };
