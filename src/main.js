import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'

import 'bulma/css/bulma.min.css'
import './styles/bulmaOverrides.css'
import './assets/fontawesome.css'
import '@fortawesome/fontawesome-free/css/fontawesome.css'

Vue.config.productionTip = false
Vue.use(VueRouter)

const routes = [
  { path: '*', component: App}
]

const router = new VueRouter({
  routes,
  mode: 'history',
})

new Vue({
  router
}).$mount('#app')
