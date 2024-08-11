const pokemonName = document.querySelector('.pokemon__name');
const pokemonNumber = document.querySelector('.pokemon__number');
const pokemonImage = document.querySelector('.pokemon__image');

const form = document.querySelector('.form');
const input = document.querySelector('.input__search');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');

let searchPokemon = 1;

const fetchPokemon = async (pokemon) => {
  const lambdaEndpoint = 'https://q4cbb3pvypaemnhyisiyessjky0ufzei.lambda-url.us-east-2.on.aws'; // Substitua pelo endpoint da sua função Lambda
  
  try {
    const response = await fetch(lambdaEndpoint, {
      method: 'POST',
      body: JSON.stringify({ 'item': pokemon }),
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error('Erro ao buscar dados do Pokémon');
    }
  } catch (error) {
    console.error('Erro na solicitação:', error);
    return null;
  }
};

const renderPokemon = async (pokemon) => {
  pokemonName.innerHTML = 'Loading...';
  pokemonNumber.innerHTML = '';
  pokemonImage.style.display = 'none'; // Inicialmente oculta a imagem

  const data = await fetchPokemon(pokemon);

  if (data) {
    // Verifica se todos os campos esperados estão presentes
    const { name = 'Unknown', id = 'N/A', imageUrl = '' } = data;

    pokemonName.innerHTML = name;
    pokemonNumber.innerHTML = id;
    pokemonImage.style.display = imageUrl ? 'block' : 'none'; // Exibe a imagem se imageUrl estiver presente
    pokemonImage.src = imageUrl;
    input.value = '';
    searchPokemon = id;
  } else {
    pokemonName.innerHTML = 'Not found :c';
    pokemonNumber.innerHTML = '';
    pokemonImage.style.display = 'none'; // Oculta a imagem se não houver dados
  }
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  renderPokemon(input.value.toLowerCase());
});

buttonPrev.addEventListener('click', () => {
  if (searchPokemon > 1) {
    searchPokemon -= 1;
    renderPokemon(searchPokemon);
  }
});

buttonNext.addEventListener('click', () => {
  searchPokemon += 1;
  renderPokemon(searchPokemon);
});

// Inicializa a página com o primeiro Pokémon
renderPokemon(searchPokemon);
