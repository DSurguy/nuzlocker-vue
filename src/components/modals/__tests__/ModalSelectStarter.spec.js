import { shallowMount, createLocalVue } from '@vue/test-utils'
import ModalSelectStarter from '../ModalSelectStarter.vue'
jest.mock('../../../services/api/index.js')
import { request, configureRequests } from '../../../services/api/index.js'
import flush from 'flush-promises'

const onComplete = jest.fn()

describe('ModalSelectStarter', function () {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(ModalSelectStarter, {
      propsData: {
        onComplete,
        run: {
          id: 0,
          game: 'red'
        }
      }
    })
  })

  it('Trigger a warning for each required field onSubmit', async function () {
    wrapper.setData({
      form: {
        fields: {
          name: "",
          level: ""
        }
      }
    })

    await wrapper.vm.onSubmit()

    expect(
      wrapper
      .find(`[test-label=warning]`)
      .findAll(`[test-label=warningField]`)
      .length
    ).toBe(2)
  })

  it('Hide warning on name when name field is updated', async function (done) {
    wrapper.setData({
      hasWarning: true,
      warningFields: ['name'],
      form: {
        fields: {
          name: 'test',
          level: 14
        }
      }
    })

    wrapper.vm.onNameChange()

    expect(
      wrapper
      .find('[test-label=warning]')
      .exists()
    ).toBe(false)

    done()
  })

  it('Hide warning on level when level field is updated', async function (done) {
    wrapper.setData({
      hasWarning: true,
      warningFields: ['level'],
      form: {
        fields: {
          name: 'test',
          level: 14
        }
      }
    })

    wrapper.vm.onLevelChange()

    expect(
      wrapper
      .find('[test-label=warning]')
      .exists()
    ).toBe(false)

    done()
  })

  it('Show any errors returned from post', async function (done) {
    configureRequests([
      {
        path: '/runs/0/events', 
        method: 'post', 
        response: {
          throw: true,
          data: {
            message: 'It broke lol'
          }
        }
      }
    ])

    wrapper.setData({
      form: {
        fields: {
          name: "something",
          level: 5
        }
      }
    })

    await wrapper.vm.onSubmit()

    expect(
      wrapper
      .find(`[test-label=error]`)
      .find(`[test-label=errorMessage]`)
      .text()
    ).toBe("It broke lol")

    done()
  })

  it('Post a new event with the expected data from form', async function (done) {
    configureRequests([
      {
        path: '/runs/0/events', 
        method: 'post', 
        response: {
          data: {} //the return data is not used
        }
      }
    ])
    request.mockClear()

    const species = 4
    const level = 5
    const name = 'potatoFace'

    const expectedData = {
      type: 'encounter',
      species,
      level,
      source: {
        location: false,
        event: true,
        identifier: 'starter'
      },
      outcome: {
        captured: true,
        name,
      }
    }

    wrapper.setData({
      form: {
        fields: {
          name,
          level,
          species
        }
      }
    })

    await wrapper.vm.onSubmit()

    expect(
      request.mock.calls[0]
    ).toEqual([
      `/runs/0/events`,
      'post',
      expectedData
    ])

    done()
  })

  it('Call onComplete when request is successful', async function (done) {
    configureRequests([
      {
        path: '/runs/0/events', 
        method: 'post', 
        response: {
          data: {} //the return data is not used
        }
      }
    ])
    
    onComplete.mockClear()

    wrapper.setData({
      form: {
        fields: {
          name: 'potatoface',
          level: 5,
          species: 4
        }
      }
    })

    await wrapper.vm.onSubmit()

    expect(
      onComplete
    ).toHaveBeenCalled()

    done()
  })

  it('Pass false to onComplete when the close button is clicked', () => {
    onComplete.mockClear()
    wrapper.find('[test-label=buttonClose]').trigger('click')
    expect(
      onComplete
    ).toHaveBeenCalledWith(false)
  })
})