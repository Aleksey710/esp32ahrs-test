//import Vue from 'vue'
//import store from './store'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router.js'

createApp(App)
  .use(router)
  .mount('#app')
