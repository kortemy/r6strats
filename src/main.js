// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@/assets/app.styl'
import '@/assets/tribute.css'

import App from '@/layouts/default'
import '@/plugins/firebase'
import '@/plugins/eventBus'
import '@/plugins/utils'
import '@/plugins/store'

Vue.use(Vuetify, {
  theme: {
    primary: '#f57c00',
    secondary: '#646464',
    accent: '#fff',
    error: '#F44336',
    info: '#81D4FA',
    success: '#AEEA00',
    warning: '#FFEA00'
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
