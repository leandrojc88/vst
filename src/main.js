import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import '@babel/polyfill'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import { initConfigs, API_URL } from '@/security/config';

// *************** Axios **********************\\
import axios from 'axios'
import vueaxios from 'vue-axios'
Vue.use(vueaxios, axios)
axios.defaults.baseURL = API_URL

// *************** CASL **********************\\
import { abilitiesPlugin } from '@casl/vue'
Vue.use(abilitiesPlugin)

// loading initials configs...
initConfigs(Vue)

Vue.config.productionTip = false
export default new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
