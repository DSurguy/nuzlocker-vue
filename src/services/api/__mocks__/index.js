let requestResponses = {}

const configureRequests = (requests) => {
  requestResponses = {}
  for( let request of requests ){
    if( !requestResponses[request.path] ) requestResponses[request.path] = {}
    if( !requestResponses[request.path][request.method] ) requestResponses[request.path][request.method] = []
    requestResponses[request.path][request.method].push(request.response)
  }
}

const request = jest.fn().mockImplementation(async (path, method, body) => {
  let response = requestResponses[path][method].shift()
  if( response.throw ){
    return Promise.reject(response.data)
  }
  else return Promise.resolve(response.data)
})

export { request, configureRequests }