import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Pokemon.css';


const Pokemon = (pokemons) => {
   

    const [pokeList, setPokeList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [filteredPokemons, setFilteredPokemons] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState('none'); //
    const [showMore, setShowMore] = useState(false);

    // const sortMethods = {
    //   none: { method: (a, b) => null },
    //   idAsc: { method: (a, b) => ( a.id - b.id)},
    //   idDesc: { method: (a, b) => ( b.id - a.id)},
    //   nameAsc: { method: (a, b) => (a > b ? 1 : -1) },
    //   nameDesc: { method: (a, b) => (a > b ? -1 : 1) },
    // };
   
    let BASE_URL = `https://pokeapi.co/api/v2/pokemon/`;

    const colors = {
        normal: '#A8A77A',
        fire: '#EE8130',
        water: '#6390F0',
        electric: '#F7D02C',
        grass: '#7AC74C',
        ice: '#96D9D6',
        fighting: '#C22E28',
        poison: '#A33EA1',
        ground: '#E2BF65',
        flying: '#A98FF3',
        psychic: '#F95587',
        bug: '#A6B91A',
        rock: '#B6A136',
        ghost: '#735797',
        dragon: '#6F35FC',
        dark: '#705746',
        steel: '#B7B7CE',
        fairy: '#D685AD',
    };



    async function getPokeDetails() {
    

     try {
         const pokemonList = await Promise.all(
          pokemons.pokemons.map(async (pokemon, index) => {
          
            const detailsResponse = await axios.get(`${BASE_URL}${pokemon.id}`);
            const details = detailsResponse.data;
             console.log(details.types);
            return {
              id: details.id,
              name: details.name,
              image: details.sprites.front_shiny,
              height: details.height,
              weight: details.weight,
              types: 
              details.types.map(type => type.type.name).sort((a, b) => a.type > b.type ? -1 : 1).join(', '),
              stats:details.stats.map(stat => stat.stat.name).sort((a, b) => a.stat > b.stat ? -1 : 1).join(', '),
              baseStats:details.stats.map(stat => stat.base_stat).sort((a, b) => a - b).join(', '),
              abilities: details.abilities.map(able => able.ability.name).sort((a, b) => a.ability > b.ability ? -1 : 1).join(', ')
             };
          })
        );
    
            setPokeList(pokemonList);
            setIsLoading(false);
            console.log(pokemonList);
       }catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    useEffect(() => {
        getPokeDetails() 
    },[])

    
    const toggleGridView = () => {
        setViewMode('grid');
      };
    
      const toggleListView = () => {
        setViewMode('list');
      };

      useEffect(() => {
        const filtered = pokeList.filter(pokemon =>
          pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    
        // Sort the filteredPokemons based on the selected sorting option
    const sortedPokemons = filtered.sort((a, b) => {
        // console.log('a and b',a,b,filtered)
        if (sortOption === 'id_asc') {
          return a.id - b.id;
        } else if (sortOption === 'id_desc') {
          return b.id - a.id;
         }else if (sortOption === 'name_asc') {
                if (a.name < b.name)return -1;
                if (a.name > b.name)return 1;
                return 0;
          }else if (sortOption === 'name_desc') {
               if (a.name > b.name)return -1;
                if (a.name < b.name)return 1;
                return 0;
         }
        //  else if (sortOption === 'types') {
        //   const typesA = a.types.map(type => type.type.name).join(', ');
        //   const typesB = b.types.map(type => type.type.name).join(', ');
        //   return typesA.localeCompare(typesB);
        // } 
        //     else  if (sortOption === 'moves') {
        //         const movesA = a.moves.length;
        //         const movesB = b.moves.length;
        //         return movesA - movesB;
        //     }else  if (sortOption === 'abilities'){
        //         const abilitiesA = a.abilities.map(ability => ability.ability.name).join(', ');
        //         const abilitiesB = b.abilities.map(ability => ability.ability.name).join(', ');
        //         return abilitiesA.localeCompare(abilitiesB);
        //     }
    else{
          return 0; // Add your sorting logic here
           }
       });
  
      setFilteredPokemons(sortedPokemons);
  }, [searchQuery, sortOption, pokeList]);
      return(
        <div>
        
        <div className='sortSearchView'>

                <div>
                    <input
                     className="search-container"
                    type="text"
                    placeholder="Search Pokémon"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                <div>
                  <select
                    value={sortOption}
                    onChange={e => setSortOption(e.target.value)}
                    >
                    <option value="id_asc">Sort by ID (Ascending)</option>
                    <option value="id_desc">Sort by ID (Descending)</option>
                    <option value="name_asc">Sort by Name (Ascending)</option>
                    <option value="name_desc">Sort  by Name (Descending)</option>
                    {/* <option value="moves">Sort by Moves</option> */}
                    </select>
                 </div>
                <div>
                <button className={viewMode === 'grid' ? 'active' : ''} onClick={toggleGridView}>
                  Grid View
                </button>
                <button className={viewMode === 'list' ? 'active' : ''} onClick={toggleListView}>
                  List View
                </button>
                </div>
              </div>


            {/* <ul>
                {pokemons.sort(sortMethods[sortState].method).map((el, i) => (
                  <li key={i}>{el}</li>
                ))}
              </ul> */}

              {isLoading ? (
                <p>Loading...</p>
              ) :viewMode === 'grid' ? (
              <ul className='flex-container'>
              
              {filteredPokemons.map((res) => {
                  const primaryType = res.types.split(', ')[0];
                  const backgroundColor = colors[primaryType] || '#87CEEB';  
                  const color = colors[primaryType] || '#000000';

                return (
                  <li className='card' key={res.id} style={{ border:`3px solid ${color}`}} >
                    <div className='card-body'>
                      <img className="card-image" style={{ backgroundColor }} src={res.image} alt='pokemon'/>
                      <p className='card-text'>ID :<b style={{color}}>#{res.id}</b></p>
                      <p className='card-text'>Name :<b style={{color}}>{res.name}</b> </p>
                     
                      {showMore && (<div>
                      <p className='card-text'>Height:<b style={{color}}>{res.height}</b></p>
                      <p className='card-text'>Weight:<b style={{color}}>{res.weight}</b></p>
                      <p className='card-text' >Types:<b style={{color}}>{res.types}</b></p>
                      <p className='card-text'>BaseStats:<b style={{color}}>{res.baseStats}</b></p>
                      <p className='card-text'>Stats:<b style={{color}}>{res.stats}</b></p>
                      <p className='card-text'>Abilities:<b style={{color}}>{res.abilities}</b></p>
                      </div> )}
                      <button className='moreLessButton' onClick={()=>setShowMore(!showMore)}>
                      {showMore ? "Show Less" : "Details"}
                      </button>
                    </div>
                  </li>
                );
              })}
              </ul>
              
              ) : (
                
                filteredPokemons.map((res) => {
                  const primaryType = res.types.split(', ')[0];
                  const backgroundColor = colors[primaryType] || '#87CEEB';
                  const color = colors[primaryType] || '#87CEEB'; 

                  // Default to black if type not found
                    return (
                      <div className="list-container" key={res.id} style={{ border:`3px solid ${color}`}} >
                      <div className="list-image" style={{ backgroundColor }}>
                        <img src={res.image} alt='pokemon' />
                      </div>
                      <div className='list-body' >
                      <p className='card-text'>ID :<b style={{color}}>#{res.id}</b></p>
                      <p className='card-text'>Name :<b style={{color}}>{res.name}</b> </p>
                      <p className='card-text'>Height:<b style={{color}}>{res.height}</b></p>
                      <p className='card-text'>Weight:<b style={{color}}>{res.weight}</b></p>
                      <p className='card-text' >Types:<b style={{color}}>{res.types}</b></p>
                      <p className='card-text'>BaseStats:<b style={{color}}>{res.baseStats}</b></p>
                      <p className='card-text'>Stats:<b style={{color}}>{res.stats}</b></p>
                      <p className='card-text'>Abilities:<b style={{color}}>{res.abilities}</b></p>
                      </div>
                  </div>
                    )})
                )}
                </div>
              )
            }

            export default Pokemon;














 // https://stackoverflow.com/questions/65874624/how-to-toggle-between-two-css-classes-view-types-with-react
// https://github.com/kamranahmedse/githunt/blob/next/src/feed.js