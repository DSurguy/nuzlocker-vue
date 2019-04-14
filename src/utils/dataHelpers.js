import pokemon from '../data/pokemon.js'
import games from '../data/games.js'
import safeGet from './safeGet.js'


const memo_getPokemonByGame = {}
export function getPokemonByGame(gameId){
  if( memo_getPokemonByGame[gameId] ) return memo_getPokemonByGame[gameId]
  const generation = games.byId[gameId].generation
  const result = pokemon.items.filter(item => item.generations.includes(generation))
  memo_getPokemonByGame[gameId] = result
  return result
}


export function translateGame(gameId){
  return safeGet(games, `byId.${gameId}.name`, "")
}

export function gameIntroText(gameId){
  return safeGet(games, `byId.${gameId}.introText`, "")
}