const games = {
  items: [{
    id: 'red',
    name: 'Pokemon Red',
    introText: "A world of dreams and adventures with Pokemon awaits! Let's go!",
    generation: 1
  }, {
    id: 'blue',
    name: 'Pokemon Blue',
    introText: "A world of dreams and adventures with Pokemon awaits! Let's go!",
    generation: 1
  }],
  byId: {}
}

//copy references by id
games.items.forEach((item, index) => {
  games.byId[item.id] = games.items[index]
})

export default games