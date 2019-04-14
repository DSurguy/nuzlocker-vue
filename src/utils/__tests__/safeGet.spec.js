import safeGet from '../safeGet'

describe('safeGet', () => {
  it('Retrieve a value from a simple object', () => {
    expect(
      safeGet(
        {
          test: 'testy'
        },
        'test'
      )
    ).toBe('testy')
  })

  it('Retrieve a deeply nested value from an object', function () {
    const deepObject = {
      test: {
        level: {
          go: {
            deep: 42
          }
        }
      }
    }
    expect(
      safeGet(
        deepObject,
        'test.level.go.deep'
      )
    ).toBe(42)
  })

  it('Return default value when target property is undefined', () => {
    expect(
      safeGet(
        {
          test: undefined
        },
        'test',
        404
      )
    ).toBe(404)
  })

  it('Return default value when property chain is broken', function () {
    const deepObject = {
      test: {
        level: {}
      }
    }

    expect(
      safeGet(
        deepObject,
        'test.level.go.deep',
        404
      )
    ).toBe(404)
  })

  it('Return default value when source does not exist', () => {
    expect(
      safeGet(
        undefined,
        'test.anything',
        404
      )
    ).toBe(404)
  })

  it('Maintain object references', function () {
    const dummyObject = {
      test: {
        nested: {
          some: 'value'
        }
      }
    }

    expect(
      safeGet(
        dummyObject,
        'test.nested',
        404
      )
    ).toBe(dummyObject.test.nested)
  })

  it('Handle array indexes', function () {
    const testObject = {
      arr: ['a','b','c']
    }

    expect(
      safeGet(
        testObject,
        'arr.2',
        404
      )
    ).toBe('c')
  })
})