const fetch = require('node-fetch');

const resolvers = {
  Query: {
    info: () => 'This is the PokeAPI Graphql wrapper',
    list: async () => {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon/');
      const parsedResponse = await response.json();
      return parsedResponse.results;
    }
  }
};

module.exports = { resolvers };