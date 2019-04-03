import Router from '../Router.js'

describe('Router', () => {
  describe('constructor', () => {
    it('should initialize with empty routes array', function () {
      const testRouter = new Router()
      expect(testRouter.routes).toEqual([])
    })
  })

  describe('route', () => {
    it('should create a regex for paths with no parameters', function () {
      const testRouter = new Router()
      testRouter.route('/happy/path/test', {})
      expect(testRouter.routes[0].regex.source)
        .toEqual(`^\\/happy\\/path\\/test\\/?$`)
    })

    it('should ignore extra slashes when creating regex', function () {
      const testRouter = new Router()
      testRouter.route('//happy//path/test/', {})
      expect(testRouter.routes[0].regex.source)
        .toEqual(`^\\/happy\\/path\\/test\\/?$`)
    })

    it('should create a regex for paths with multiple parameters', function () {
      const testRouter = new Router()
      testRouter.route('/runs/:runId/event/:eventId', {})
      expect(testRouter.routes[0].regex.source)
        .toEqual(`^\\/runs\\/([\\w%]+)\\/event\\/([\\w%]+)\\/?$`)
    })

    it('should store the names of multiple parameters', function () {
      const testRouter = new Router()
      testRouter.route('/runs/:runId/event/:eventId', {})
      expect(testRouter.routes[0].params)
        .toEqual(['runId', 'eventId'])
    })

    it('should store the names of multiple parameters', function () {
      const testRouter = new Router()
      testRouter.route('/runs/:runId/event/:eventId', {})
      expect(testRouter.routes[0].params)
        .toEqual(['runId', 'eventId'])
    })

    it('should store all handler from handlers', function () {
      const testRouter = new Router()
      const testFuncGet = function (){}
      const testFuncPut = function (){}
      const testFuncPost = function (){}
      const testFuncDelete = function (){}
      testRouter.route('/test', {
        get: testFuncGet,
        put: testFuncPut,
        post: testFuncPost,
        delete: testFuncDelete
      })
      expect(testRouter.routes[0].handlers).toEqual({
        get: testFuncGet,
        put: testFuncPut,
        post: testFuncPost,
        delete: testFuncDelete
      })
    })

    it('should ignore non-whitelisted http verbs', function () {
      const testRouter = new Router()
      const testFuncGet = function (){}
      const testFuncPotato = function (){}
      testRouter.route('/test', {
        get: testFuncGet,
        potato: testFuncPotato
      })
      expect(testRouter.routes[0].handlers).toEqual({
        get: testFuncGet,
        put: undefined,
        post: undefined,
        delete: undefined
      })
    })
  })
})