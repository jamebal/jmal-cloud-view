import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import { setFavicon } from '@/utils/logo'
import '@/utils/common'
import '@/utils/web'

import 'element-theme-darkplus/lib/index.color.css';

import '@/styles/index.scss' // global css
import uploader from 'vue-simple-uploader'
import EVueContextmenu from 'e-vue-contextmenu'
import App from './App'
import store from './store'
import router from './router'

import VueI18n from 'vue-i18n';
import { loadLocaleMessages, getBrowserLocale } from '@/utils/loadLocaleMessages';

setFavicon()

// ant-design-vue
import { Affix } from 'ant-design-vue';
Vue.use(Affix)

import contentmenu from '@/components/VContextmenu'
import '@/components/VContextmenu/styles/index.css'
Vue.use(contentmenu)

import '@/icons' // icon
import '@/permission' // permission control

import Viewer from 'v-viewer'


Vue.use(Viewer)

// Vue.use(VueWechatTitle)

Vue.use(uploader)
Vue.use(EVueContextmenu)

Vue.use(vant.ImagePreview)

import Minder from '@/components/Minder'
Vue.use(Minder)

Vue.use(VueI18n);

const messages = loadLocaleMessages();

const locale = store.getters.lang || getBrowserLocale(messages);

// i18n
const i18n = new VueI18n({
  locale: locale,
  fallbackLocale: 'en_US',
  messages,
});

// 自动切换主题
// function applySystemTheme() {
//   const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
//   document.documentElement.classList.toggle('dark', isDark);
// }
//
// applySystemTheme();
//
// window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
//   document.documentElement.classList.toggle('dark', e.matches);
// });

new Vue({
  el: '#app',
  i18n,
  router,
  store,
  render: h => h(App),
})
import config from '../package.json'
console.log(
  `%c jmal-cloud-view %c v${config.version} %c`,
  'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
  'background:#409eff ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff',
  'background:transparent'
)

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
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
