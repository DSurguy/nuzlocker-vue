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
  })
})