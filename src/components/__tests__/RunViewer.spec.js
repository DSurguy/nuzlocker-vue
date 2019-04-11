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
import { translateGame } from '../../utils/pokemon.js'

jest.mock('../../services/api/index.js')
import { request, configureRequests } from '../../services/api/index.js'

describe('RunViewer', () => {
  describe('Data Loading', () => {
    it('Display a 404 when the run is not found', async function (done) {
      configureRequests([
        {
          path: '/run/potato',
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
            path: '/run/potato',
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
          path: '/run/1',
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
            path: '/run/1',
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
          path: '/run/1',
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
        }
      ])

      const wrapper = shallowMount(RunViewer, {
        mocks: {
          $route: {
            path: '/run/1',
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
  })
})