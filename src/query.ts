import { gql } from "@apollo/client";
import { Pokemon } from "./types";

const QUERY_GET_POKEMON_BY_ID = gql`
  query GetPokemonById($name: String!) {
    pokemon_v2_pokemon(where: {
      pokemon_v2_pokemonspecy: {
        pokemon_v2_pokemonspeciesnames: {
          name: {_eq: $name}
        }
      }
    }) {
      id
      name
      pokemon_v2_pokemontypes {
        pokemon_v2_type {
          name
          pokemon_v2_typenames(
            where: { pokemon_v2_language: { name: { _eq: "ja" } } }
          ) {
            name
          }
        }
      }
      pokemon_v2_pokemonspecy {
        pokemon_v2_pokemonspeciesnames(
          where: { pokemon_v2_language: { name: { _eq: "ja" } } }
        ) {
          name
        }
        pokemon_v2_pokemonspeciesflavortexts(
          where: {
            pokemon_v2_language: { name: { _eq: "ja" } }
            # ソードを指定すると、ソード未登場のポケモンだと説明がない・・・
            # pokemon_v2_version: { name: { _eq: "sword" } }
          }
        ) {
          flavor_text
        }
      }
      pokemon_v2_pokemonstats {
        pokemon_v2_stat {
          pokemon_v2_statnames(
            where: { pokemon_v2_language: { name: { _eq: "ja" } } }
          ) {
            name
            pokemon_v2_language {
              name
            }
          }
          game_index
          name
        }
        base_stat
        effort
      }
      pokemon_v2_pokemonsprites {
        sprites
      }
    }
  }
`;

const gqlPokemonToPokemon = (gqlResult: any): Pokemon | null => {
  const p = gqlResult.pokemon_v2_pokemon[0];
  if (!p) return null;
  const stats = p.pokemon_v2_pokemonstats;
  const imageUrl = JSON.parse(p.pokemon_v2_pokemonsprites?.[0]?.sprites)?.other?.['official-artwork']?.['front_default'];

  const statsMap = new Map<string, number>(stats.map(({pokemon_v2_stat: {name}, base_stat}: any) => [name, base_stat]));
  return {
    id: p?.id,
    name: p?.pokemon_v2_pokemonspecy?.pokemon_v2_pokemonspeciesnames[0]?.name,
    imageUrl,
    type1:
      p.pokemon_v2_pokemontypes[0]?.pokemon_v2_type?.pokemon_v2_typenames?.[0]?.name,
    type2:
      p.pokemon_v2_pokemontypes[1]?.pokemon_v2_type?.pokemon_v2_typenames?.[0]
        .name,
    description:
      p.pokemon_v2_pokemonspecy?.pokemon_v2_pokemonspeciesflavortexts?.[0]
        ?.flavor_text,
    status: {
      hp: statsMap.get('hp') as number,
      attack: statsMap.get('attack') as number,
      defense: statsMap.get('defense') as number,
      specialAttack: statsMap.get('special-attack') as number,
      specialDefense: statsMap.get('special-defense') as number,
      speed: statsMap.get('speed') as number,
    },
  };
};

export { QUERY_GET_POKEMON_BY_ID, gqlPokemonToPokemon };
