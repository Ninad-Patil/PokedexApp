import React,{useEffect,useState} from 'react'
import PokemonCard from "./PokemonCard"
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css"
import style from "./card.module.css"
function PokemonList() {
    const [pokeList,getPokeList] = useState([])
    const [prevUrl,setPrevUrl] = useState('')
    const [nextUrl,setNextUrl] = useState('')

    const initialUrl = "https://pokeapi.co/api/v2/pokemon/"
    
    const prev = async function(){
  
        getPokeNames(prevUrl)
    }
    const next = async function(){
        getPokeNames(nextUrl)
    }
    async function getPokeNames(url){           
        try{ const res = await fetch(url)
        const data = await res.json()

        setPrevUrl(data.previous)
        setNextUrl(data.next)
        getPokeList(data.results)
        }
        catch(e){
            console.log(e.message)
        }
       
     }


    useEffect(()=>{
        getPokeNames(initialUrl)
        return () => {
            getPokeList([])
        }
    },[])
    
 
    return (
        <>
        <nav className="navbar navbar-light" style={{backgroundColor:"#f5f9fa",display:"flex",justifyContent:"center"}}>
        <button className="btn btn-outline-info" style={{margin:"0.2rem"}} onClick={prev}>previous</button>
        <button className="btn btn-outline-info" onClick={next}>next</button>
        </nav>
        <div  className={style.cards}>
            {pokeList.map(pokemon=>{
                return <PokemonCard 
                    name = {pokemon.name}
                    url = {pokemon.url}
                    key = {pokemon.url}
                />
            })}
        </div>
        </>
    )
}

export default PokemonList
