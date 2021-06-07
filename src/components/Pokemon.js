import React,{useEffect,useState}from 'react'
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css"
import style from "./pokemon.module.css"
const colorTypes={
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
}

function Pokemon(props) {
    const {pokemonIndex} = props.match.params
    const [pokemon,getPokemon] = useState({
        name:"",
        pokemonIndex:"",
        imageUrl:"",
        types:[],
        description:"",
        stats :{
            hp:"",
            defense:"",
            attack:"",
            speed:"",
            specialAttack:"",
            specialDefense:""
        },
        height:"",
        weight:"",
        eggGroup:"",
        abilities:"",
        genderRatioMale:"",
        genderRatioFemale:"",
        evs:"",
        catchRate:"",
        hatchSteps:""
    })
    const getInfo = async()=>{
        try{const pokeRes =await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonIndex}/`)
            const data = await pokeRes.json()
            const species = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonIndex}/`)
            const speciesData = await species.json()

            const name=data.name;
            const imageUrl = data.sprites.front_default;

            let {hp,attack,defense,speed,specialAttack,specialDefense} = "";
            data.stats.map(stat => {
                 switch(stat.stat.name){
                    case "hp":
                      hp = stat.base_stat;
                     break
                    case "attack":
                         attack = stat.base_stat;
                        break
                    case "defense":
                         defense = stat.base_stat;
                        break
                    case "speed":
                        speed = stat.base_stat;
                        break
                    case "special-attack":
                       specialAttack = stat.base_stat;
                        break
                    case "special-defense":
                         specialDefense = stat.base_stat;
                        break
                    default:
                        return ""
                }
            })
            //decimeters to feet
            const height = Math.round((data.height * 0.328084 + 0.0001)*100)/100
            //hectogram to pounds
            const weight = Math.round((data.weight * 0.220462 + 0.0001)*100)/100

            const types  = data.types.map(type => (type.type.name))

            const abilities = data.abilities.map(ability =>{
                return ability.ability.name
                       .toLowerCase()
                       .split('-')
                       .map(word =>(word.charAt(0).toUpperCase()+word.substring(1)))
                       .join(',')
            })

            const evs = data.stats
            .filter(stat =>{
                return stat.effort > 0
            })
            .map(stat =>{
                return` ${stat.effort} ${stat.stat.name}`
                .toLowerCase()
                .split('-')
                .map(word =>(word.charAt(0).toUpperCase()+word.substring(1)))
                .join(' ')
            })
            .join(',')

            //getting the specific pokemon description and other info
            let description = ""
            speciesData.flavor_text_entries.some(flavor =>{
                if (flavor.language.name === "en"){
                     description = flavor.flavor_text;  
                }
                
            })

            // api gives chance of gender out of 8
            const femaleRate = speciesData.gender_rate;
            const genderRatioMale = 12.5 *femaleRate;
            const genderRatioFemale = 12.5 *(8-femaleRate);

            //api gives chance of gender out of 255
            const catchRate = Math.round((100/255)*speciesData.capture_rate)

            const eggGroup = speciesData.egg_groups
            .map(group =>{
                return group.name
                .toLowerCase()
                .split('-')
                .map(word =>(word.charAt(0).toUpperCase()+word.substring(1)))
                .join(',')
            })
            .join(', ');

            const hatchSteps = 255 * (speciesData.hatch_counter + 1);

            getPokemon({
                genderRatioFemale,
                genderRatioMale,
                description,
                catchRate,
                eggGroup,
                imageUrl,
                hatchSteps,
                name,
                pokemonIndex,
                types,
                stats:{
                    hp,
                    defense,
                    attack,
                    speed,
                    specialAttack,
                    specialDefense
                },
                height,
                weight,
                abilities,
                evs
                
            })


        }
        catch(e){
            console.log(e.message)
        }
    }


    useEffect(() => {       
        //const species =`https://pokeapi.co/api/v2/pokemon-species/${pokemonIndex}/`
            getInfo() 
        

    })
    return (
        
        <div className={style.card}>
        <div className="col">
        <div className="card">
          <div className="card-header">
            <div className="row">
              <div className="col-5">
                <h5>{pokemon.pokemonIndex}</h5>
              </div>
              <div className="col-7">
                <div className="float-right">
                  {pokemon.types.map(type => (
                    <span
                      key={type}
                      className="badge badge-pill mr-1"
                      style={{
                        backgroundColor: `${colorTypes[type]}`,
                        color: 'white'
                      }}
                    >
                      {type
                        .toLowerCase()
                        .split(' ')
                        .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                        .join(' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="row align-items-center">
              <div className=" col-md-3 ">
                <img
                  src={pokemon.imageUrl}
                  alt="pokemon"
                  className="card-img-top rounded mx-auto mt-2"
                />
              </div>
              <div className="col-md-9">
                <h4 className="mx-auto">
                  {pokemon.name
                    .toLowerCase()
                    .split(' ')
                    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(' ')}
                </h4>
                <div className="row align-items-center">
                  <div className={`col-12 col-md-3`}>
                    HP
                  </div>
                  <div className={`col-12 col-md-9`}>
                    <div className="progress">
                      <div
                        className="progress-bar "
                        role="progressbar"
                        style={{
                          width: `${pokemon.stats.hp}%`
                         
                        }}
                        aria-valuenow="25"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <small>{pokemon.stats.hp}</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row align-items-center">
                  <div className={`col-12 col-md-3`}>
                    Attack
                  </div>
                  <div className={`col-12 col-md-9`}>
                    <div className="progress">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${pokemon.stats.attack}%`
                         
                        }}
                        aria-valuenow="25"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <small>{pokemon.stats.attack}</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row align-items-center">
                  <div className={`col-12 col-md-3`}>
                    Defense
                  </div>
                  <div className={`col-12 col-md-9`}>
                    <div className="progress">
                      <div
                        className="progress-bar "
                        role="progressbar"
                        style={{
                          width: `${pokemon.stats.defense}%`
                          
                        }}
                        aria-valuenow="25"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <small>{pokemon.stats.defense}</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row align-items-center">
                  <div className={`col-12 col-md-3`}>
                    Speed
                  </div>
                  <div className={`col-12 col-md-9`}>
                    <div className="progress">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${pokemon.stats.speed}%`
                         
                        }}
                        aria-valuenow="25"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <small>{pokemon.stats.speed}</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row align-items-center">
                  <div className={`col-12 col-md-3`}>
                    Sp Atk
                  </div>
                  <div className={`col-12 col-md-9`}>
                    <div className="progress">
                      <div
                        className="progress-bar "
                        role="progressbar"
                        style={{
                          width: `${pokemon.stats.specialAttack}%`
                    
                        }}
                        aria-valuenow={pokemon.stats.specialAttack}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <small>{pokemon.stats.specialAttack}</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row align-items-center">
                  <div className={`col-12 col-md-3`}>
                    Sp Def
                  </div>
                  <div className={`col-12 col-md-9`}>
                    <div className="progress">
                      <div
                        className="progress-bar "
                        role="progressbar"
                        style={{
                          width: `${pokemon.stats.specialDefense}%`
                          
                        }}
                        aria-valuenow={pokemon.stats.specialDefense}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <small>{pokemon.stats.specialDefense}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-1">
              <div className="col">
                <p className="">{pokemon.description}</p>
              </div>
            </div>
          </div>
          <hr />
          <div className="card-body">
            <h5 class="card-title text-center">Profile</h5>
            <div className="row">
              <div className="col-md-6">
                <div className="row">
                  <div className="col-6">
                    <h6 className="float-right">Height:</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-left">{pokemon.height} ft.</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-right">Weight:</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-left">{pokemon.weight} lbs</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-right">Catch Rate:</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-left">{pokemon.catchRate}%</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-right">Gender Ratio:</h6>
                  </div>
                  <div className="col-6">
                    <div class="progress">
                      <div
                        class="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${pokemon.genderRatioFemale}%`,
                          backgroundColor: '#c2185b'
                        }}
                        aria-valuenow="15"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <small>{pokemon.genderRatioFemale}</small>
                      </div>
                      <div
                        class="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${pokemon.genderRatioMale}%`,
                          backgroundColor: '#1976d2'
                        }}
                        aria-valuenow="30"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <small>{pokemon.genderRatioMale}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="row">
                  <div className="col-6">
                    <h6 className="float-right">Egg Groups:</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-left">{pokemon.eggGroup} </h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-right">Hatch Steps:</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-left">{pokemon.hatchSteps}</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-right">Abilities:</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-left">{pokemon.abilities}</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-right">EVs:</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-left">{pokemon.evs}</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer text-muted">
            Data From{' '}
            <a href="https://pokeapi.co/" rel="noreferrer" target="_blank" className="card-link">
              PokeAPI.co
            </a>
          </div>
        </div>
      </div>
    </div>

    )
}

export default Pokemon
