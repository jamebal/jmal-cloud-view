import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import '@/utils/common'
import '@/utils/web'

import '@/styles/index.scss' // global css
import uploader from 'vue-simple-uploader'
import EVueContextmenu from 'e-vue-contextmenu'
import App from './App'
import store from './store'
import router from './router'

// ant-design-vue
import { Affix } from 'ant-design-vue';
Vue.use(Affix)

import contentmenu from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'
Vue.use(contentmenu)

import '@/icons' // icon
import '@/permission' // permission control

import Viewer from 'v-viewer'

// import APlayer from 'vue-aplayer';
// Vue.use(APlayer, {
//   defaultCover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60', // 设置播放器默认封面图片
//   productionTip: false, // 是否在控制台输出版本信息
// });

Vue.use(Viewer)

// Vue.use(VueWechatTitle)

Vue.use(uploader)
Vue.use(EVueContextmenu)

Vue.use(vant.ImagePreview)

import Minder from '@/components/Minder'
Vue.use(Minder)

import APlayer from '@moefe/vue-aplayer';
Vue.use(APlayer, {
  defaultCover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=200&q=60',
  productionTip: false, // 是否在控制台输出版本信息
});

new Vue({
  el: '#app',
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
