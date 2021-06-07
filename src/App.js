import './App.css';
import Pokemon from "./components/Pokemon"
import PokemonList from './components/PokemonList';
//import style from "./components/card.module.css"
import {BrowserRouter as Router,Switch,Route} from "react-router-dom"
function App() {
  return (
    <Router>
    <div className="App">
      <>
        <Switch>
          <Route exact path='/' component={PokemonList} />
          <Route exact path='/pokemon/:pokemonIndex' component={Pokemon} />
        </Switch>
      </>
    </div>
    </Router>
  );
}

export default App;
