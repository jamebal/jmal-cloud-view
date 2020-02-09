import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css
import uploader from 'vue-simple-uploader'
import EVueContextmenu from 'e-vue-contextmenu'
import App from './App'
import store from './store'
import router from './router'
import WeVue from 'we-vue'
import 'we-vue/lib/style.css'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)
Vue.use(WeVue)

Vue.use(uploader)
Vue.use(EVueContextmenu)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
  Vue.prototype.$pc = false
} else {
  Vue.prototype.$pc = true
  let winWidth = document.documentElement.offsetWidth ||
    document.body.offsetWidth
  winWidth = winWidth < 1366 ? 1366 : winWidth
  const oHtml = document.getElementsByTagName('html')[0]
  oHtml.style.fontSize = 100 * winWidth / 1920 + 'px'
  window.addEventListener('resize', function() {
    let winWidth = document.documentElement.offsetWidth || document.body.offsetWidth
    winWidth = winWidth < 1366 ? 1366 : winWidth
    const oHtml = document.getElementsByTagName('html')[0]
    oHtml.style.fontSize = 100 * winWidth / 1920 + 'px'
  })
}
