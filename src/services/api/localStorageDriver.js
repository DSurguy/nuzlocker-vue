export function create (keys, data){
  const path = buildPathPartsFromKeys(keys).join('/')
  //get the current list data
  const currentList = getList(path)
  //create the individual item
  localStorage.setItem(
    `${path}/${currentList.nextId}`, 
    JSON.stringify(Object.assign(data, {id: currentList.nextId}))
  )
  //update the list
  currentList.childKeys.push(currentList.nextId)
  currentList.nextId++
  delete currentList.children
  localStorage.setItem(path, JSON.stringify(currentList))
}

export function update (keys, data){}

export function replace (keys, data){}

export function remove (keys, data){}

export function retrieve (keys){
  const pathParts = buildPathPartsFromKeys(keys)
  let returnValue
  if( pathParts.length !== keys.length*2 ){
    //we're getting a list of items, and we assume the last key had a value of null
    const path = pathParts.join('/')
    returnValue = getList(path).children
  }
  else{
    //we're getting a specific item, just retrieve it
    path = pathParts.join('/')
    //this will throw if access is denied
    returnValue = JSON.parse(localStorage.getItem(path))
  }
  return returnValue
}

function getList(path){
  const listData = JSON.parse(localStorage.getItem(path))
  if( !listData ) {
    return {
      nextId: 0,
      childKeys: [],
      children: []
    }
  }
  const children = []
  for( let key of listData.childKeys ){
    children.push(
      JSON.parse(localStorage.getItem(
        `${path}/${key}`
      ))
    )
  }
  return {
    nextId: listData.nextId,
    childKeys: listData.childKeys,
    children
  }
}

function buildPathPartsFromKeys(keys){
  return keys.map((key) => {
    return `${encodeURIComponent(key.key)}${key.value ? `/${key.value}` : ''}`
  })
}