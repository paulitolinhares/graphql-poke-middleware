const fetch = require('node-fetch');
const DataLoader = require('dataloader');

const pokemonLoader = new DataLoader(async keys => {
  return keys.map(async url => {
    const response = await fetch(url);
    const jsonResponse = await response.json();
    return jsonResponse;
  })
});

const pokemonMoveLoader = new DataLoader(async keys => {
  return keys.map(async url => {
    const response = await fetch(url);
    const jsonResponse = await response.json();
    return jsonResponse;
  })
});

const resolvers = {
  Query: {
    info: () => 'This is the PokeAPI Graphql wrapper',
    list: async (root, { page = 0, offset = 20 }) => {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon/');
      const { results } = await response.json();
      const offsetStart = page * offset;
      const offsetEnd = offsetStart + offset;
      const olderPokemonUrls = results
        .slice(offsetStart, offsetEnd) // loads only the real pokemon :P
        .map(item => item.url);

      const data = await pokemonLoader.loadMany(olderPokemonUrls);
      return data;
    },
    find: async (root, { id }) => {
      return await pokemonLoader.load(`https://pokeapi.co/api/v2/pokemon/${id}`)
    }
  },
  Pokemon: {
    imageFull: ({ id }) => {
      return `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${id.toString().padStart(3,'0')}.png`
    },
    imageThumb: ({ id }) => {
      return `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${id.toString().padStart(3,'0')}.png`
    },
    types: ({ types }) => types.map(({ type: { name } }) => ({ name })),
    abilities: ({ abilities }) => abilities.map(({ ability: { name } }) => ({ name })),
    stats: ({ stats }) => stats.map(({ base_stat, stat: { name } }) => ({ name, scale: base_stat })),
    moves: ({ moves }) => moves.map(({ move }) => move)
  },
  PokemonMove: {
    accuracy: async ({ url }) => {
      const { accuracy } = await pokemonMoveLoader.load(url);
      return accuracy;
    },
    power: async ({ url }) => {
      const { power } = await pokemonMoveLoader.load(url);
      return power;
    },
    powerPoints: async ({ url }) => {
      const { pp } = await pokemonMoveLoader.load(url);
      return pp;
    },
  }
};

module.exports = { resolvers };