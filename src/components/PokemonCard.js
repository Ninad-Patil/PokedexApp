import React,{useEffect,useState} from 'react'
import style from "./card.module.css"
import {Link} from "react-router-dom"
function PokemonCard(props) {
    const [poke,setPoke] = useState({})
    useEffect(()=>{
        const url = props.url
        const index = url.split("/")[url.split("/").length -2]
        const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index}.png`
        
        setPoke({
            pokemon:props.name,
            url:imgUrl,
            index:index,
        })

        // return () => {
        //     setPoke({})
        // }
    },[props.url,props.name] )
    
    return (
        <Link to={`pokemon/${poke.index}`} className={style.link}>
        <div className={style.card}>
           <div className={style.cardHeader}> <h1 >{poke.index}</h1> </div>
            <div className={style.cardBody}>
                <img className={style.pokeImg}alt="pokemon" src={poke.url}></img>  
            </div>       
                <h2 className={style.pokeName}>{props.name.toLowerCase()
                .split(' ')
                .map((word) =>  word.charAt(0).toUpperCase()+word.substring(1))
                .join(" ")}</h2>
           
        </div>
        </Link>
        
    )
}

export default PokemonCard
