import * as localStorageDriver from '../localStorageDriver.js'

describe('localStorageDriver', () => {
  afterEach(() => {
    window.localStorage.getItem.mockClear()
    window.localStorage.setItem.mockClear()
    window.localStorage.removeItem.mockClear()
    window.localStorage.clear()
  })

  describe('create', () => {
    it('Create a new item with a new ID in an empty store', () => {
      localStorageDriver.create([
        {key: 'runs', value: null}
      ], {
        data: 'test'
      })
      expect(
        window.localStorage
        .getStore()['runs/0']
      ).toBe(JSON.stringify({data: 'test', id: 0}))
    })

    it('Create a new item with multiple keys', () => {
      localStorageDriver.create([
        {key: 'runs', value: 1},
        {key: 'events', value: 12},
        {key: 'subEvents', value: null}
      ], {
        data: 'test'
      })
      expect(
        window.localStorage
        .getStore()['runs/1/events/12/subEvents/0']
      ).toBe(JSON.stringify({data: 'test', id: 0}))
    })

    it('Create a new item with an incremented ID if some exist', () => {
      Object.assign(
        window.localStorage.getStore(),
        {
          'runs': JSON.stringify({nextId: 1, childKeys: [0]}),
          'runs/0': JSON.stringify({data: 'test', id: 0})
        }
      )
      localStorageDriver.create([
        {key: 'runs', value: null}
      ], {
        data: 'test'
      })
      expect(
        window.localStorage
        .getStore()['runs/1']
      ).toBe(JSON.stringify({data: 'test', id: 1}))
    })

    it('Update list metadata after inserting an item', () => {
      localStorageDriver.create([
        {key: 'runs', value: null}
      ], {
        data: 'test'
      })
      expect(
        window.localStorage
        .getStore()['runs']
      ).toBe(JSON.stringify({nextId: 1, childKeys: [0]}))
    })

    it('Allow insert at explicit key', () => {
      localStorageDriver.create([
        {key: 'runs', value: 14}
      ], {
        data: 'test'
      })
      expect(
        window.localStorage
        .getStore()['runs/14']
      ).toBe(JSON.stringify({data: 'test', id: 14}))
    })

    it('Update list metadata at explicit key when greater than nextId', () => {
      localStorageDriver.create([
        {key: 'runs', value: 14}
      ], {
        data: 'test'
      })
      expect(
        window.localStorage
        .getStore()['runs']
      ).toBe(JSON.stringify({nextId: 15, childKeys: [14]}))
    })

    it('Update list metadata at explicit key when less than nextId', () => {
      Object.assign(
        window.localStorage.getStore(),
        {
          'runs': JSON.stringify({nextId: 5, childKeys: [4]}),
          'runs/4': JSON.stringify({data: 'test', id: 4})
        }
      )
      localStorageDriver.create([
        {key: 'runs', value: 2}
      ], {
        data: 'test'
      })
      expect(
        window.localStorage
        .getStore()['runs']
      ).toBe(JSON.stringify({nextId: 5, childKeys: [2,4]}))
    })

    it('Throw an error when trying to create a key that exists', () => {
      Object.assign(
        window.localStorage.getStore(),
        {
          'runs': JSON.stringify({nextId: 5, childKeys: [4]}),
          'runs/4': JSON.stringify({data: 'test', id: 4})
        }
      )
      expect(() => {
        localStorageDriver.create([
          {key: 'runs', value: 4}
        ], {
          data: 'test'
        })
      }).toThrow()
    })

    it('Return the created object and key when flag is set', () => {
      expect(
        localStorageDriver.create([
          {key: 'runs', value: null}
        ], {
          data: 'test'
        }, {
          returnCreated: true
        })
      ).toEqual({
        path: '/runs/0',
        item: {
          data: 'test',
          id: 0
        }
      })
    })
  })

  describe('retrieve', () => {
    it('should get back a single item', () => {
      Object.assign(
        window.localStorage.getStore(),
        {
          'runs': JSON.stringify({nextId: 1, childKeys: [0]}),
          'runs/0': JSON.stringify({data: 'test', id: 0})
        }
      )
      expect(
        localStorageDriver.retrieve([
          {key: 'runs', value: 0}
        ])
      ).toEqual({data: 'test', id: 0})
    })

    it('should get back a nested single item', () => {
      Object.assign(
        window.localStorage.getStore(),
        {
          'runs': JSON.stringify({nextId: 1, childKeys: [0]}),
          'runs/0': JSON.stringify({data: 'test', id: 0}),
          'runs/0/events': JSON.stringify({nextId: 3, childKeys: [2]}),
          'runs/0/events/2': JSON.stringify({data: 'testEvent', id: 2})
        }
      )
      expect(
        localStorageDriver.retrieve([
          {key: 'runs', value: 0},
          {key: 'events', value: 2}
        ])
      ).toEqual({data: 'testEvent', id: 2})
    })

    it('should get back a list with all children', () => {
      Object.assign(
        window.localStorage.getStore(),
        {
          'runs': JSON.stringify({nextId: 4, childKeys: [0,1,3]}),
          'runs/0': JSON.stringify({data: 'test', id: 0}),
          'runs/1': JSON.stringify({data: 'test2', id: 1}),
          'runs/3': JSON.stringify({data: 'test3', id: 3})
        }
      )
      expect(
        localStorageDriver.retrieve([
          {key: 'runs', value: null}
        ])
      ).toEqual([
        {data: 'test', id: 0},
        {data: 'test2', id: 1},
        {data: 'test3', id: 3}
      ])
    })

    it('should throw an error with a code of 404 when item does not exist', () => {
      Object.assign(
        window.localStorage.getStore(),
        {
          'runs': JSON.stringify({nextId: 4, childKeys: [0,1,3]}),
          'runs/0': JSON.stringify({data: 'test', id: 0})
        }
      )
      let returnedError
      try{
        localStorageDriver.retrieve([
          {key: 'runs', value: 42}
        ])
      } catch (e) {
        returnedError = e
      }
      expect(
        returnedError
      ).toHaveProperty('code', 404)
    })

    it('should return an empty list when key is not found', () => {
      expect(
        localStorageDriver.retrieve([
          {key: 'runs', value: 42},
          {key: 'events'}
        ])
      ).toEqual([])
    })
  })
})