let detailPokemon = document.querySelector('.pokemons');
const showModal = document.querySelector('.modal-overlay');
const modalContent = document.querySelector('.modal');


//..show modal..
detailPokemon.addEventListener('click', async (event)=>{
    const aboutPokemon = event.target.closest('.pokemon');
    if(aboutPokemon){
        const pokemonName = aboutPokemon.querySelector('.name').textContent.toLowerCase();
        await fetchPokemonDetails(pokemonName);
        showModal.classList.add('show');

    }

})

// ... pokemon detail ...

async function fetchPokemonDetails (name){
    try{
        const response = await fetch (`https://pokeapi.co/api/v2/pokemon/${name}`);
        if(!response.ok) throw new Error ('Erro ao buscar detalhes do Pokemon');
        const data = await response.json();

        //...
        modalContent.innerHTML = `
            <div class="pokemon ${data.types[0].type.name}">

                <h2>${data.name.charAt(0).toUpperCase()+ data.name.slice(1)}</h2>
                <p class="number">#${data.id}</p>
                <div class="detail">
                    <ol class="types">
                        ${data.types.map((typeSlot) => `<li class="type ${typeSlot.type.name}">${typeSlot.type.name}</li>`).join('')}
                    </ol>
                </div>
                <img src="${data.sprites.other.home.front_default}" alt="${data.name}">
                
            </div>
            <nav>
                <a href="#about" class="active">About</a>
                <a href="#baseStatus">Base Status</a>
            
            </nav>

     
            
            <div class="detailsPokemon active " id="about"> 
                <p><strong>Altura:</strong> ${data.height / 10}m</p>
                <p><strong>Peso:</strong> ${data.weight / 10}kg</p>
                <p><strong>Habilidades:</strong> ${data.abilities.map(a => a.ability.name).join(', ')}</p>
                
            </div>

            <div class="detailsPokemon" id="baseStatus">
                
                <div class="status">
                    <p>HP</p>
                    <span class="statusValue"> ${data.stats[0].base_stat}</span>
                    <div class="progress-container">
                        <div class="progress-bar"> </div>
                    </div>
                </div>
            
                <div class="status">
                    <p>Attack</p>
                    <span class="statusValue"> ${data.stats[1].base_stat}</span>
                    <div class="progress-container">
                        <div class="progress-bar"> </div>
                    </div>
                </div>
                
                <div class="status">
                    <p>Defense</p>
                    <span class="statusValue"> ${data.stats[2].base_stat}</span>
                    <div class="progress-container">
                        <div class="progress-bar"> </div>
                    </div>
                </div>

                <div class="status">
                    <p>Esp.Attack</p>
                    <span class="statusValue"> ${data.stats[3].base_stat}</span>
                    <div class="progress-container">
                        <div class="progress-bar"> </div>
                    </div>
                </div>

                <div class="status">
                    <p>Esp.Defense</p>
                    <span class="statusValue"> ${data.stats[4].base_stat}</span>
                    <div class="progress-container">
                        <div class="progress-bar"> </div>
                    </div>
                </div>

                <div class="status">
                    <p>Speed</p>
                    <span class="statusValue"> ${data.stats[5].base_stat}</span>
                    <div class="progress-container">
                        <div class="progress-bar"> </div>
                    </div>
                </div>

            </div>
            
              
            `;

            updateStatusBar();


    } catch (error) {
        console.log(error);
        modalContent.innerHTML = `<p>Erro ao carregar detalhes do Pokemon</p>`; 

    }

}



//..close modal..
showModal.addEventListener('click',(event)=>{
    if(event.target === showModal){
        showModal.classList.remove('show');
    }
})


//...ajuste de estilo do menu dentro do modal...
document.addEventListener('click', function(event) {
    if (event.target.closest('nav a')) {
      const activeMenuContent = document.querySelectorAll('.active');
      activeMenuContent.forEach(link => link.classList.remove('active'));
      event.target.classList.add('active');
    }
  });



  //--- base status bar ----
  const updateStatusBar = () => {
        const statusValue = document.querySelectorAll('.statusValue');
        const progressBars = document.querySelectorAll('.progress-bar');


        statusValue.forEach((valor, index) => {
            const maxStatusValue = 100;
            const width = (parseInt(valor.textContent) / maxStatusValue) * 100;
    
            progressBars[index].style.width = `${width}%`;
    
            if (width <= 50) {
                progressBars[index].style.backgroundColor = 'rgb(255, 0, 0)';
            } else {
                progressBars[index].style.backgroundColor = 'rgb(17, 184, 39)';
            }
        });
    };
    

  

  
