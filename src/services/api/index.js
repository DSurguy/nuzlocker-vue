import Router from './Router.js'

const myRouter = new Router()
myRouter.route('/runs', {
  get: async function (params){
    return true
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