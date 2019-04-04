import Router from '../Router.js'

describe('Router', () => {
  describe('constructor', () => {
    it('should initialize with empty routes array', function () {
      const testRouter = new Router()
      expect(testRouter.routes).toEqual([])
    })
  })

  describe('request', () => {
    it('should call the method handler when regex matches on a route', async function (){
      expect.assertions(1)
      const testRouter = new Router()
      const mockFunc = jest.fn()
      testRouter.route('/happy/path/test', {
        get: mockFunc
      })
      await testRouter.request('/happy/path/test', 'get')
      expect(mockFunc).toHaveBeenCalled()
    })

    it('should call the first matching route handler when multiple exist for some reason', async function (){
      expect.assertions(2)
      const testRouter = new Router()
      const mockFunc = jest.fn()
      const mockFuncTheSecond = jest.fn()
      testRouter.route('/happy/path/test', {
        get: mockFunc
      })
      testRouter.route('/happy/path/test', {
        get: mockFuncTheSecond
      })
      await testRouter.request('/happy/path/test', 'get')
      expect(mockFunc).toHaveBeenCalled()
      expect(mockFuncTheSecond).toHaveBeenCalledTimes(0)
    })

    it('should call the correct method handler when multiple exist', async function (){
      expect.assertions(1)
      const testRouter = new Router()
      const mockFuncGet = jest.fn()
      const mockFuncPut = jest.fn()
      testRouter.route('/happy/path/test', {
        get: mockFuncGet,
        put: mockFuncPut
      })
      await testRouter.request('/happy/path/test', 'put')
      expect(mockFuncPut).toHaveBeenCalled()
    })

    it('should call the method handler with a params object', async function (){
      expect.assertions(1)
      const testRouter = new Router()
      const mockFuncGet = jest.fn()
      testRouter.route('/happy/:id/test/:second', {
        get: mockFuncGet
      })
      await testRouter.request('/happy/12/test/banana', 'get')
      expect(mockFuncGet).toHaveBeenCalledWith(
        {
          id: '12',
          second: 'banana'
        },
        undefined
      )
    })

    it('should call the method handler with a body object', async function (){
      expect.assertions(1)
      const testRouter = new Router()
      const mockFuncPost = jest.fn()
      testRouter.route('/happy/path/test', {
        post: mockFuncPost
      })
      await testRouter.request('/happy/path/test', 'post', {
        content: 'yes'
      })
      expect(mockFuncPost).toHaveBeenCalledWith(
        {},
        {
          content: 'yes'
        }
      )
    })

    it('should throw an error when no routes match, without calling any handlers', async function (){
      expect.assertions(1)
      const testRouter = new Router()
      const mockFunc = jest.fn()
      testRouter.route('/happy/path/test', {
        get: mockFunc
      })
      try{
        await testRouter.request('/unhappy/path/test', 'get')
      } catch (e){
        expect(e.message).toEqual(
          `Path /unhappy/path/test did not match any routes.`
        )
      }
    })

    it('should not call any handlers when no routes match', async function (){
      expect.assertions(1)
      const testRouter = new Router()
      const mockFunc = jest.fn()
      testRouter.route('/happy/path/test', {
        get: mockFunc
      })
      try{
        await testRouter.request('/unhappy/path/test', 'get')
      } catch (e){
        expect(mockFunc).toHaveBeenCalledTimes(0)
      }
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