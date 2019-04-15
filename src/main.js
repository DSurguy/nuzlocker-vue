import Vue from 'vue'
import VueRouter from 'vue-router'

import 'bulma/css/bulma.min.css'
import './styles/bulmaOverrides.css'
import './assets/fontawesome.css'
import '@fortawesome/fontawesome-free/css/fontawesome.css'
import './styles/sprite-pokemon.css'
import routes from './routes.js'

Vue.config.productionTip = false
Vue.use(VueRouter)

const router = new VueRouter({
  routes,
  mode: 'history',
})

new Vue({
  router
}).$mount('#app')
