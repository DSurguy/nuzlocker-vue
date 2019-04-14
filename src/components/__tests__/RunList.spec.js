import { mount } from '@vue/test-utils'
import RunList from '../RunList.vue'
import CreateRunModal from '../modals/CreateRunModal.vue'
import flush from 'flush-promises'
import {translateGame} from '../../utils/dataHelpers.js'

jest.mock('../../services/api/index.js')
import { request, configureRequests } from '../../services/api/index.js'

describe('RunList', () => {
  beforeEach(() => {
    request.mockClear()
  })
  describe('Initialize', function () {
    let wrapper
    beforeEach(() => {
      configureRequests([
        {
          path: '/runs', 
          method: 'get', 
          response: {
            data: []
          }
        }
      ])
      wrapper = mount(RunList, {
        stubs: {
          CreateRunModal: true
        }
      })
    })
    it('Render a button to create a new run', () => {
      expect(
        wrapper
        .find('button[test-label=createNewRunButton]')
        .exists()
      ).toBe(true)
    })

    it('Contain CreateRunModal initialized to inactive', () => {
      expect(
        wrapper
        .find(CreateRunModal)
        .exists()
      ).toBe(false)
    })

  })

  describe('Interaction', function () {
    let wrapper
    beforeEach( async (done) => {
      configureRequests([
        {
          path: '/runs', 
          method: 'get', 
          response: {
            data: []
          }
        }
      ])
      wrapper = mount(RunList, {
        stubs: {
          CreateRunModal: true
        }
      })
      await flush()
      done()
    })
    it('CreateRunModal should become active when createNewRunButton is clicked', () => {
      wrapper
        .find('[test-label=createNewRunButton]')
        .trigger('click')

      expect(
        wrapper
          .find(CreateRunModal)
          .exists()
      ).toBe(true)
    })

    it('CreateRunModal should become inactive when onCreateRunModalClose is called', () => {
      //activate the modal directly
      wrapper.setData({
        createRunActive: true
      })

      //call onCreateRunModalClose
      wrapper.vm.onCreateRunModalClose()

      //see if the modal is inactive
      expect(
        wrapper
          .find(CreateRunModal)
          .exists()
      ).toBe(false)
    })

    it('CreateRunModal should become inactive when onCreateRunModalComplete is called', () => {
      configureRequests([
        {
          path: '/runs', 
          method: 'get', 
          response: {
            data: []
          }
        }
      ])
      //activate the modal directly
      wrapper.setData({
        createRunActive: true
      })

      //call onCreateRunModalClose
      wrapper.vm.onCreateRunModalComplete()

      //see if the modal is inactive
      expect(
        wrapper
          .find(CreateRunModal)
          .exists()
      ).toBe(false)
    })

    it('CreateRunModal should become active when createRun is called', () => {
      //deactivate the modal directly
      wrapper.setData({
        createRunActive: false
      })

      //call onCreateRunModalClose
      wrapper.vm.createRun()

      //see if the modal is inactive
      expect(
        wrapper
          .find(CreateRunModal)
          .exists()
      ).toBe(true)
    })

  })

  describe('Data Retrieval', function () {
    it('Make a request for runs', async (done) => {
      configureRequests([
        {
          path: '/runs', 
          method: 'get', 
          response: {
            data: [
              {id: 0, name: 'test', game: 'red'}
            ]
          }
        }
      ])
      let wrapper = mount(RunList, {
        stubs: {
          CreateRunModal: true
        }
      })
      await flush()
      expect(request).toHaveBeenCalledWith('/runs', 'get')
      done()
    })

    it('Render a run for each returned from the endpoint', async (done) => {
      configureRequests([
        {
          path: '/runs', 
          method: 'get', 
          response: {
            data: [
              {id: 0, name: 'test', game: 'red'},
              {id: 1, name: 'test2', game: 'blue'}
            ]
          }
        }
      ])
      let wrapper = mount(RunList, {
        stubs: {
          CreateRunModal: true
        }
      })

      await flush()
      expect(
        wrapper.findAll('[test-label=run]').length
      ).toBe(2)
      done()
    })

    it('Render the name of a run returned from the endpoint', async (done) => {
      configureRequests([
        {
          path: '/runs', 
          method: 'get', 
          response: {
            data: [
              {id: 0, name: 'test', game: 'red'}
            ]
          }
        }
      ])
      let wrapper = mount(RunList, {
        stubs: {
          CreateRunModal: true
        }
      })

      await flush()
      expect(
        wrapper
        .find('[test-label=runName]')
        .html()
      ).toBe(`<span test-label="runName">test</span>`)
      done()
    })

    it('Render the game of a run returned from the endpoint', async (done) => {
      configureRequests([
        {
          path: '/runs', 
          method: 'get', 
          response: {
            data: [
              {id: 0, name: 'test', game: 'red'}
            ]
          }
        }
      ])
      let wrapper = mount(RunList, {
        stubs: {
          CreateRunModal: true
        }
      })

      await flush()
      expect(
        wrapper
        .find('[test-label=runGame]')
        .html()
      ).toBe(`<span test-label="runGame">${translateGame('red')}</span>`)
      done()
    })

    it('Render an error when the request fails', async (done) => {
      configureRequests([
        {
          path: '/runs',
          method: 'get',
          response: {
            data: new Error('Some error message'),
            throw: true
          }
        }
      ])
      let wrapper = mount(RunList, {
        stubs: {
          CreateRunModal: true
        }
      })

      await flush()
      expect(
        wrapper
        .find('[test-label=requestError]')
        .html()
      ).toBe(`<span test-label="requestError">Some error message</span>`)
      done()
    })
  })
})