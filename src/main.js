import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { $request } from './utils/request'
import i18n from './locales'
Vue.prototype.$request = $request
Vue.config.productionTip = false

new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
