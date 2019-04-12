const isDefined = (val) => {
  return val !== undefined && val !== null
}

/**
 * 
 * @param {Array<Object>} keys - parent keys of the item that should be inserted, signature [{ key: String, [value]: String }]
 * @param {Object} data - Data to insert at the location indicated by keys
 */
export function create (keys, data){
  try{
    const lastKeyValue = keys.slice(-1)[0].value
    const pathParts = buildPathPartsFromKeys(keys)
    let listPath
    if( isDefined(lastKeyValue) ){
      //get the current list data
      listPath = pathParts.slice(0,-1).join('/')
    }
    else {
      listPath = pathParts.join('/')
    }
    const currentList = getShallowList(listPath)
    const nextId = isDefined(lastKeyValue) ? lastKeyValue : currentList.nextId
    if( currentList.childKeys.find(key => key === nextId) ) throw new Error('Item already exists')
    localStorage.setItem(
      `${listPath}/${nextId}`, 
      JSON.stringify(Object.assign(data, {id: nextId}))
    )
    //update the list
    currentList.childKeys.push(nextId)
    currentList.childKeys.sort()
    currentList.nextId = nextId >= currentList.nextId ? nextId+1 : currentList.nextId
    localStorage.setItem(listPath, JSON.stringify(currentList))
  } catch (e) {
    e.code = 500
    throw e
  }
}

export function update (keys, data){}

export function replace (keys, data){}

export function remove (keys, data){}

export function retrieve (keys){
  let returnValue
  try{
    const pathParts = buildPathPartsFromKeys(keys)
    let path
    if( pathParts.length !== keys.length*2 ){
      //we're getting a list of items, and we assume the last key had a value of null
      path = pathParts.join('/')
      returnValue = getList(path).children
    }
    else{
      //we're getting a specific item, just retrieve it
      path = pathParts.join('/')
      //this will throw if access is denied
      returnValue = JSON.parse(localStorage.getItem(path))
    }
  } catch (e){
    e.code = 500
    throw e
  }

  if( !returnValue ) {
    const notFound = new Error('Item not found')
    notFound.code = 404
    throw notFound
  }
  return returnValue
}

function getShallowList(path){
  const listData = JSON.parse(localStorage.getItem(path))
  if( !listData ) {
    return {
      nextId: 0,
      childKeys: []
    }
  }
  return {
    nextId: listData.nextId,
    childKeys: listData.childKeys
  }
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
  return keys.reduce((parts, key) => {
    parts.push(encodeURIComponent(key.key))
    if( key.value !== undefined && key.value !== null ) parts.push(`${key.value}`)
    return parts
  }, [])
}