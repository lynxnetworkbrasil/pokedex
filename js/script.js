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
  const pokemonId = parseInt(pokemon);
  const response = await fetch(lambdaEndpoint, {
    method: 'POST',
    body: JSON.stringify({ 'item': pokemonId }),
    headers: { 'Content-Type': 'application/json' }
  });

  if (response.status === 200) {
    const data = await response.json();
    return data;
  } else {
    throw new Error('Erro ao buscar dados do Pokémon');
  }
};

const renderPokemon = async (pokemon) => {

  pokemonName.innerHTML = 'Loading...';
  pokemonNumber.innerHTML = '';

  try {
    const data = await fetchPokemon(pokemon);

    if (data) {
      pokemonImage.style.display = 'block';
      pokemonName.innerHTML = data.name;
      pokemonNumber.innerHTML = data.id;
      pokemonImage.src = data.imageUrl; // Supondo que a função Lambda retorne a URL da imagem
      input.value = '';
      searchPokemon = data.id;
    } else {
      pokemonImage.style.display = 'none';
      pokemonName.innerHTML = 'Not found :c';
      pokemonNumber.innerHTML = '';
    }
  } catch (error) {
    console.error(error);
    // Exibir mensagem de erro para o usuário
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

renderPokemon(searchPokemon); 1 
