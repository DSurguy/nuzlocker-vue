import Router from './Router.js'

function delayedResolve(value){
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(value), 0)
  })
}

const myRouter = new Router()
myRouter.route('/runs', {
  get: async function (params){
    return delayedResolve([
      { id: 0, title: 'testo'}
    ]) 
  },
  post: async function (params, body){
    return true
  }
})

myRouter.route('/runs/:runId', {
  get: async function (params){
    return true
  },
  put: async function (params, body){
    return true
  },
  delete: async function (params){
    return true
  }
})

export default async function request(path, method, body){
  return await myRouter.request(path, method, body)
}