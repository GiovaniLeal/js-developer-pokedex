
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default || pokeDetail.sprites.other.home.front_default

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}

/* ... search pokemons by type */
pokeApi.getPokemonsByType = async (type, limit = 10, offset = 0) => {
    const url = `https://pokeapi.co/api/v2/type/${type}/`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erro ao buscar tipo: ${response.status}`);

        const data = await response.json();

        const pokemonUrls = data.pokemon
            .slice(offset, offset + limit) // 🔥 Aplica paginação nos Pokémon retornados pela API
            .map(p => p.pokemon?.url)
            .filter(url => url && url.startsWith("https://pokeapi.co/api/v2/pokemon/"));

        const pokemonDetails = await Promise.all(
            pokemonUrls.map(async (url) => {
                try {
                    const details = await pokeApi.getPokemonDetail({ url });
                    if (!details) throw new Error(`Erro ao buscar detalhes para: ${url}`);
                    return details;
                } catch (err) {
                    console.error(`Erro ao buscar detalhes do Pokémon (${url}):`, err);
                    return null;
                }
            })
        );

        return pokemonDetails.filter(pokemon => pokemon !== null);
    } catch (error) {
        console.error("Erro ao buscar Pokémons por tipo:", error);
        return [];
    }
};