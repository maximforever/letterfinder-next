import { Character } from "./Character"

const fetchRandomPokemonName = async () => {
  const url = "https://pokeapi.co/api/v2/pokemon?limit=150";

  const pokemonData = await fetch(url).then((res) => res.json());
  console.log(pokemonData);
  const randomPokemon = pokemonData.results[Math.floor(Math.random() * pokemonData.results.length)];
  return randomPokemon.name;
};

export const WordPanel = async() => {

  const breakTextIntoCharacters = async () => {
    const text = await fetchRandomPokemonName();
    return text.split("").map((char, index) => <Character key={index} char={char} />);
  }

  return (
    <div>
      {await breakTextIntoCharacters()}
    </div>
  )
}