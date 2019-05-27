import { shallowMount } from '@vue/test-utils'
import ModalEncounter from '../ModalEncounter.vue'
jest.mock('../../../services/api/index.js')
import { request, configureRequests } from '../../../services/api/index.js'

const onComplete = jest.fn()

const shallowMount_field = () => {
  return shallowMount(ModalEncounter, {
    propsData: {
      onComplete,
      encounterType: 'field',
      run: {
        id: 0,
        game: 'red'
      }
    }
  })
}

const shallowMount_event = () => {
  return shallowMount(ModalEncounter, {
    propsData: {
      onComplete,
      encounterType: 'event',
      run: {
        id: 0,
        game: 'red'
      }
    }
  })
}

const shallowMount_eventWithProps = (props) => {
  return shallowMount(ModalEncounter, {
    propsData: {
      onComplete,
      encounterType: 'event',
      run: {
        id: 0,
        game: 'red'
      },
      ...props
    }
  })
}

describe('ModalEncounter', function () {
  let wrapper

  it('Trigger a warning for each required field onSubmit', async function (done) {
    wrapper = shallowMount_event()
    wrapper.setData({
      form: {
        fields: {
          name: "",
          level: "",
          source: '',
          captured: true
        }
      }
    })

    await wrapper.vm.onSubmit()

    expect(
      wrapper
      .find(`[test-label=warning]`)
      .findAll(`[test-label=warningField]`)
      .length
    ).toBe(3)

    done()
  })

  it('Allow empty name when pokemon is not captured', async function (done){
    wrapper = shallowMount_event()
    wrapper.setData({
      form: {
        fields: {
          name: "",
          level: "",
          source: '',
          captured: false
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

    done()
  })

  it('Hide warning on name when name field is updated', async function (done) {
    wrapper = shallowMount_event()
    wrapper.setData({
      hasWarning: true,
      warningFields: ['name'],
      form: {
        fields: {
          name: 'test',
          level: 14,
          source: '1',
          captured: true
        }
      }
    })

    wrapper.vm.onFieldChange()

    expect(
      wrapper
      .find('[test-label=warning]')
      .exists()
    ).toBe(false)

    done()
  })

  it('Hide warning on level when level field is updated', async function (done) {
    wrapper = shallowMount_event()
    wrapper.setData({
      hasWarning: true,
      warningFields: ['level'],
      form: {
        fields: {
          name: 'test',
          level: 14,
          source: '1'
        }
      }
    })

    wrapper.vm.onFieldChange()

    expect(
      wrapper
      .find('[test-label=warning]')
      .exists()
    ).toBe(false)

    done()
  })

  it('Hide warning on source when source field is updated', async function (done) {
    wrapper = shallowMount_event()
    wrapper.setData({
      hasWarning: true,
      warningFields: ['source'],
      form: {
        fields: {
          name: 'test',
          level: 14,
          source: '1'
        }
      }
    })

    wrapper.vm.onFieldChange()

    expect(
      wrapper
      .find('[test-label=warning]')
      .exists()
    ).toBe(false)

    done()
  })

  it('Show any errors returned from post', async function (done) {
    wrapper = shallowMount_event()
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
          level: 5,
          source: '1'
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

  it('Post a new field encounter event with the expected data from form', async function (done) {
    wrapper = shallowMount_field()
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
    const source = 0
    const type = 'field'
    const captured = true

    const expectedData = {
      type: 'encounter',
      species,
      level,
      source: {
        type,
        id: 0
      },
      outcome: {
        captured,
        name,
      }
    }

    wrapper.setData({
      form: {
        fields: {
          name,
          level,
          species,
          source,
          captured
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

  it('Post a new event encounter event with the expected data from form', async function (done) {
    wrapper = shallowMount_event()
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
    const name = ''
    const source = 0
    const type = 'event'
    const captured = false

    const expectedData = {
      type: 'encounter',
      species,
      level,
      source: {
        type,
        id: 0
      },
      outcome: {
        captured,
        name,
      }
    }

    wrapper.setData({
      form: {
        fields: {
          name,
          level,
          species,
          source,
          captured
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
    ).toHaveBeenCalledWith(true)
  })

  it('Disable source when preloaded from props', () => {
    wrapper = shallowMount_eventWithProps({
      encounterSource: 'starter'
    })

    expect(
      wrapper
      .find('[test-label=formFieldSource]')
      .is('[disabled]')
    ).toBe(true)
  })

  it('Disable species when preloaded from props', () => {
    wrapper = shallowMount_eventWithProps({
      encounterSpecies: 1
    })

    expect(
      wrapper
      .find('[test-label=formFieldSpecies]')
      .is('[disabled]')
    ).toBe(true)
  })

  it('Disable captured when preloaded from props', () => {
    wrapper = shallowMount_eventWithProps({
      encounterCaptured: true
    })

    expect(
      wrapper
      .find('[test-label=formFieldCaptured]')
      .is('[disabled]')
    ).toBe(true)
  })
})