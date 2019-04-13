export function translateGame(gameId){
  switch(gameId){
    case 'red': return "Pokemon Red"
    case 'blue': return "Pokemon Blue"
  }
  return ""
}

export function gameIntroText(gameId){
  switch (gameId){
    case 'red': 
    case 'blue': return "A world of dreams and adventures with Pokemon awaits! Let's go!"
  }
}