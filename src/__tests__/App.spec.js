/**
 * This will mostly just test that the correct components
 *  are loaded for each route
 * 
 * Please remember that you need to look at main.js
 *  to determine the route structure, and which routes 
 *  are children of App.
 * 
 * I don't like this, but it's faster to put up with it.
 * 
 * https://vue-test-utils.vuejs.org/guides/using-with-vue-router.html
 */
import { mount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import { nextTick } from 'vue'

import App from '../App.vue'
import RunList from '../components/RunList.vue'
import RunViewer from '../components/RunViewer.vue'

import routes from '../routes.js'

describe('routing', () => {
  let localVue
  let router
  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(VueRouter)
    router = new VueRouter({ routes })
  })

  it('/ -> RunList', async function (done) {
    const wrapper = mount(App, {
      localVue,
      router,
      stubs: {
        RunList: true
      }
    })

    router.push("/")

    nextTick(() => {
      expect(
        wrapper
        .find(RunList)
        .exists()
      ).toBe(true)
      done()
    })
  })

  it('/ -> RunViewer', async function (done) {
    const wrapper = mount(App, {
      localVue,
      router,
      stubs: {
        RunViewer: true
      }
    })

    router.push("/runs/1")

    nextTick(() => {
      expect(
        wrapper
        .find(RunViewer)
        .exists()
      ).toBe(true)
      expect(
        wrapper.vm.$route.params.runId
      ).toBe('1')
      done()
    })
  })
})