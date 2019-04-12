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
        { key: 'runs', value: null}
      ])
    ) 
  },
  post: async function (params, body){
    const newRun = create([
      { key: 'runs' }
    ], body, {
      returnCreated: true
    })
    create([
      { key: 'runs', value: newRun.item.id },
      { key: 'events' }
    ], {
      type: 'run-start'
    })
    return delayedResolve(newRun.item)
  }
})

myRouter.route('/runs/:runId', {
  get: async function (params){
    return delayedResolve(
      retrieve([
        { key: 'runs', value: params.runId}
      ])
    )
  },
  put: async function (params, body){
    return true
  },
  delete: async function (params){
    return true
  }
})

export async function request(path, method, body){
  return await myRouter.request(path, method, body)
}