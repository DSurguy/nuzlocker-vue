import Vue from 'vue'
import App from './App.vue'

import 'bulma/css/bulma.min.css'
import './styles/bulmaOverrides.css'
import './assets/fontawesome.css'
import '@fortawesome/fontawesome-free/css/fontawesome.css'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
