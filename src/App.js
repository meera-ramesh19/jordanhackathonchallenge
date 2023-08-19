import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pokemon from './Pokemon';


export default function App() {
 
    const [pokemons, setPokemons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
  
  
  let BASE_URL = `https://pokeapi.co/api/v2/pokemon?limit=50`;
 
   async function getCharacters() {
      
    try {
    axios.get(BASE_URL).then((res) => { 
      let pokemonList = res.data.results;
      console.log('response=', pokemonList);
      
      let pokemonArr = pokemonList.map((pokemon, index) => ({
        ...pokemon,
        id: index + 1,
image:`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
          index + 1
        }.png`,
        
      }));

      setPokemons(pokemonArr);
      
    })
    }catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  useEffect(() => {
        getCharacters();
  },[]);

  return (
    <div>
      <h1>Pokemon Stats</h1>
      <Pokemon   pokemons={pokemons} />
    </div>
  )
    
    }
  
