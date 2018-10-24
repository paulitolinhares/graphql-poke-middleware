const fetch = require('node-fetch');
const Dataloader = require('dataloader');

const pokemonLoader = new Dataloader(async keys => {
  return keys.map(async url => {
    const response = await fetch(url);
    const jsonResponse = await response.json();
    return jsonResponse;
  })
})

const resolvers = {
  Query: {
    info: () => 'This is the PokeAPI Graphql wrapper',
    list: async () => {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon/');
      const { results } = await response.json();
      const olderPokemonUrls = results
        .slice(0, 1) // loads only the real pokemon :P
        .map(item => item.url);

      const data = await pokemonLoader.loadMany(olderPokemonUrls);
      return data;
    }
  },
  Pokemon: {
    imageFull: ({ id }) => {
      return `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${id.toString().padStart(3,'0')}.png`
    },
    imageThumb: ({ id }) => {
      return `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${id.toString().padStart(3,'0')}.png`
    },
    types: ({ types }) => {
      return types.map(({ type: { name } }) => ({ name }));
    }
  }
};

module.exports = { resolvers };