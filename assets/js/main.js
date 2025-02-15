const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');

// Variáveis de controle 
const maxRecords = 151;
const limit = 10;
let offset = 0;
let currentType = null;
let currentOffset = 0;
let loadedPokemons = []; // 🔥 Armazena os Pokémon carregados

/* ... Convertendo Pokémon em uma lista HTML ... */
function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
                     
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
            </div>
        </li>
    `;
}

/* ... Função para carregar Pokémon na tela (default) ... */
function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        loadedPokemons = [...loadedPokemons, ...pokemons]; // 🔥 Mantém os antigos e adiciona novos
        renderPokemons(loadedPokemons);
    });
}

/* ... Função para renderizar Pokémon na tela ... */
function renderPokemons(pokemons) {
    pokemonList.innerHTML = pokemons.map(convertPokemonToLi).join('');
}

/* ... Evento para carregar Pokémon na inicialização ... */
loadPokemonItens(offset, limit);

/* ... Evento para carregar mais Pokémon ... */
loadMoreButton.addEventListener('click', async () => {
    currentOffset += limit;

    try {
        if (currentType) {
            // 🔥 Se houver um filtro ativo, buscamos mais Pokémon do mesmo tipo!
            const pokemons = await pokeApi.getPokemonsByType(currentType, limit, currentOffset);
            loadedPokemons = [...loadedPokemons, ...pokemons]; // 🔥 Mantém os antigos e adiciona novos
            renderPokemons(loadedPokemons);
        } else {
            // 🔥 Senão, carregamos mais Pokémon normalmente
            loadPokemonItens(currentOffset, limit);
        }
    } catch (error) {
        console.error("Erro ao carregar mais Pokémon:", error);
    }
});

/* ... Buscar Pokémon por tipo através do botão de navegação ... */
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.nav-item button');

    buttons.forEach(button => {
        button.addEventListener('click', async () => {
            const type = button.id;
            currentType = type === "ver-todos" ? null : type;
            currentOffset = 0; // 🔥 Resetamos o offset sempre que um novo filtro for aplicado
            loadedPokemons = []; // 🔥 Resetamos a lista carregada

            try {
                if (!currentType) {
                    loadPokemonItens(currentOffset, limit);
                } else {
                    const pokemons = await pokeApi.getPokemonsByType(currentType, limit, currentOffset);
                    loadedPokemons = pokemons; // 🔥 Atualiza a lista global com os Pokémon filtrados
                    renderPokemons(loadedPokemons);
                }
            } catch (error) {
                console.error("Erro ao buscar Pokémons:", error);
            }
        });
    });
});