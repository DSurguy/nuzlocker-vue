import { mount } from '@vue/test-utils'
import CreateRunModal from '../CreateRunModal.vue'
jest.mock('../../../services/api/index.js')
import { request, configureRequests } from '../../../services/api/index.js'
import flush from 'flush-promises'

let onComplete = jest.fn()
let onClose = jest.fn()

describe('CreateRunModal', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(CreateRunModal, {
      propsData: {
        onClose,
        onComplete
      }
    })
  })
  describe('Initialize', function (){
    it('Contain expected form fields', () => {
      expect(
        wrapper
        .find(`input[test-label=formName]`)
        .exists()
      ).toBe(true)
      expect(
        wrapper
        .find(`select[test-label=formGame]`)
        .exists()
      ).toBe(true)
    })

    it('Contain a submit button', () => {
      expect(
        wrapper
        .find(`button[test-label=buttonSubmit]`)
        .exists()
      ).toBe(true)
    })

    it('Contain a close button', () => {
      expect(
        wrapper
        .find(`button[test-label=buttonClose]`)
        .exists()
      ).toBe(true)
    })

    it('Initialize run name to a very recent time string', () => {
      //remount to get a more recent date
      const firstTime = (new Date()).toLocaleString()
      wrapper = mount(CreateRunModal, {
        propsData: {
          onClose,
          onComplete
        }
      })

      expect(
        Date.parse(wrapper.vm.$data.form.name) - Date.parse(firstTime) < 1000
      ).toBe(true)
    })

    it('Select all text in the name input', () => {
      const inputElement = wrapper.find('[test-label=formName]').element
      expect(
        inputElement.selectionStart
      ).toBe(0)
      expect(
        inputElement.selectionEnd
      ).toBe(inputElement.value.length)
    })
  })

  describe('Interaction', function (){
    it('Show a warning when form is submitted with no name', () => {

      wrapper.find('[test-label=formName]').setValue('')
      wrapper.find('[test-label=buttonSubmit]').trigger('click')

      expect(
        wrapper
        .find('[test-label=warning]')
        .findAll('[test-label=warningField]')
        .length
      ).toBe(1)
    })

    it('Remove warnings when name is changed', () => {
      wrapper.setData({
        hasWarning: true,
        warningFields: ['test']
      })

      wrapper.find('[test-label=formName]').setValue('test')

      expect(
        wrapper
        .findAll('[test-label=warning]')
        .length
      ).toBe(0)
    })

    it('Create a new run when fields are valid', async (done) => {
      configureRequests([
        {
          path: '/runs', 
          method: 'post', 
          response: {
            data: true
          }
        }
      ])

      wrapper.find('[test-label=formName]').setValue('test')
      wrapper.find('[test-label=buttonSubmit]').trigger('click')

      await flush()

      expect(
        request
      ).toHaveBeenCalledWith('/runs', 'post', {
        name: 'test',
        game: 'red'
      })
      done()
    })

    it('Call onComplete after creating a run', async (done) => {
      configureRequests([
        {
          path: '/runs', 
          method: 'post', 
          response: {
            data: true
          }
        }
      ])
      onComplete.mockClear()

      wrapper.find('[test-label=formName]').setValue('test')
      wrapper.find('[test-label=buttonSubmit]').trigger('click')

      await flush()
      expect(
        onComplete
      ).toHaveBeenCalled()
      done()
    })
  })

  it('Show an error when the request fails', async (done) => {
    configureRequests([
      {
        path: '/runs', 
        method: 'post', 
        response: {
          data: new Error('Request Bad'),
          throw: true
        }
      }
    ])

    wrapper.find('[test-label=formName]').setValue('test')
    wrapper.find('[test-label=buttonSubmit]').trigger('click')

    await flush()
    expect(
      wrapper
      .find('[test-label=error]')
      .exists()
    ).toBe(true)
    done()
  })
})