export default function Router(){
  this.routes = []
}

Router.prototype.request = async function (path, method, body){
  for( let route of this.routes ){
    let results = path.match(route.regex)
    if( results ){
      return await route.handlers[method](
        Array.prototype.slice.call(results, 1).reduce((map, param, index) => {
          map[route.params[index]] = param
          return map
        }, {}),
        body
      )
    }
  }
}

Router.prototype.route = function (path, handlers){
  this.routes.push(
    {
      regex: new RegExp(
        `^/${
          path.split('/').filter(part=>part).map(part => {
            if( part[0] === ':' ){
              return `([\\w%]+)`
            }
            else return part
          }).join('/')
        }/?$`
      ),
      params: path.split('/').filter(part=>part[0] === ':').map(part => part.substr(1)),
      handlers
    }
  )
}