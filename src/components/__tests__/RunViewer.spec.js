/**
 * The RunViewer should show the following:
 * - Metadata about the run
 *   - Name
 *   - Game
 *   - Status
 * - Formatted List of Events
 *   - These should be components. Obvs.
 */
import { shallowMount } from '@vue/test-utils'
import RunViewer from '../RunViewer.vue'
import flush from 'flush-promises'
import EventRunStart from '../events/EventRunStart.vue'

jest.mock('../../services/api/index.js')
import { configureRequests } from '../../services/api/index.js'

describe('RunViewer', () => {
  describe('Data Loading', () => {
    it('Display a 404 when the run is not found', async function (done) {
      configureRequests([
        {
          path: '/runs/potato',
          method: 'get',
          response: {
            throw: true,
            data: {
              code: 404,
              message: 'Run not found'
            }
          }
        }
      ])

      const wrapper = shallowMount(RunViewer, {
        mocks: {
          $route: {
            path: '/runs/potato',
            params: {
              runId: 'potato'
            }
          }
        }
      })

      await flush()

      expect(
        wrapper
        .find('[test-label=notFound]')
        .exists()
      ).toBe(true)

      done()
    })

    it('Display the error when request fails', async function (done) {
      configureRequests([
        {
          path: '/runs/1',
          method: 'get',
          response: {
            throw: true,
            data: new Error('Some random request error')
          }
        }
      ])

      const wrapper = shallowMount(RunViewer, {
        mocks: {
          $route: {
            path: '/runs/1',
            params: {
              runId: '1'
            }
          }
        }
      })

      await flush()

      expect(
        wrapper
        .find('[test-label=error]')
        .exists()
      ).toBe(true)

      done()
    })

    it('Show the run name after mount', async function (done) {
      configureRequests([
        {
          path: '/runs/1',
          method: 'get',
          response: {
            data: {
              id: 1,
              name: 'testytest',
              game: 'red',
              data: {
                status: 'good'
              }
            }
          }
        },
        {
          path: '/runs/1/events',
          method: 'get',
          response: {
            data: []
          }
        }
      ])

      const wrapper = shallowMount(RunViewer, {
        mocks: {
          $route: {
            path: '/runs/1',
            params: {
              runId: '1'
            }
          }
        }
      })

      await flush()

      expect(
        wrapper
        .find('[test-label=runName]')
        .html()
      ).toBe(`<span test-label="runName">testytest</span>`)

      done()
    })

    it('Display events of type run-start', async function (done) {
      configureRequests([
        {
          path: '/runs/1',
          method: 'get',
          response: {
            data: {
              id: 1,
              name: 'testytest',
              game: 'red',
              data: {
                status: 'good'
              }
            }
          }
        },
        {
          path: '/runs/1/events',
          method: 'get',
          response: {
            data: [
              { id: 0, type: 'run-start'}
            ]
          }
        }
      ])

      const wrapper = shallowMount(RunViewer, {
        mocks: {
          $route: {
            path: '/runs/1',
            params: {
              runId: '1'
            }
          }
        }
      })

      await flush()

      expect(
        wrapper
        .findAll(EventRunStart)
        .length
      ).toBe(1)

      done()
    })
  })
})