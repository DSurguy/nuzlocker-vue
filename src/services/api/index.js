import Router from './Router.js'
import {create, retrieve} from './localStorageDriver.js'

function delayedResolve(value){
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(value), 0)
  })
}

const myRouter = new Router()
myRouter.route('/runs', {
  get: async function (params){
    return delayedResolve(
      retrieve([
        { key: 'run', value: null}
      ])
    ) 
  },
  post: async function (params, body){
    return delayedResolve(
      create([
        { key: 'run', value: null }
      ], body)
    ) 
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