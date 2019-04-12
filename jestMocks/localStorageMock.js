const localStorageMock = (function() {
  let store = {}
  return {
    getItem: jest.fn().mockImplementation((key) => {
      return store[key] || null
    }),
    setItem: jest.fn().mockImplementation((key, value) => {
      store[key] = value.toString()
    }),
    removeItem: jest.fn().mockImplementation((key) =>{
      delete store[key]
    }),
    clear: jest.fn().mockImplementation(() => {
      store = {}
    }),
    getStore: () => store
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
})