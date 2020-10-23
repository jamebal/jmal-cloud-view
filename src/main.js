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
import VueWechatTitle from 'vue-wechat-title'
// import WeVue from 'we-vue'
// import 'we-vue/lib/style.css'
import { Popup,Search, Button, Cell, CellGroup, Image, List, PullRefresh, SwipeCell, Col, Row, Divider, Sticky, NavBar, Icon, Tabbar, TabbarItem, ActionSheet, Field, Overlay, Checkbox, CheckboxGroup, Grid, GridItem} from 'vant';


// ant-design-vue
import { Affix } from 'ant-design-vue';
Vue.use(Affix)

import contentmenu from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'
Vue.use(contentmenu)

// mavonEditor
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

import '@/icons' // icon
import '@/permission' // permission control

import VueTouch from"vue-touch";
import Viewer from 'v-viewer'

import APlayer from '@moefe/vue-aplayer';
Vue.use(APlayer, {
  defaultCover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60', // 设置播放器默认封面图片
  productionTip: false, // 是否在控制台输出版本信息
});

Vue.use(Viewer)
Vue.use(VueTouch, {name:'v-touch'})

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
// Vue.use(WeVue)

Vue.use(VueWechatTitle)

// 有赞的移动UI
Vue.use(Popup);
Vue.use(Search);
Vue.use(Button);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(Image);
Vue.use(List);
Vue.use(PullRefresh);
Vue.use(SwipeCell);
Vue.use(Col);
Vue.use(Row);
Vue.use(Divider);
Vue.use(Sticky);
Vue.use(NavBar);
Vue.use(Icon);
Vue.use(Tabbar);
Vue.use(TabbarItem);
Vue.use(ActionSheet);
Vue.use(Field);
Vue.use(Overlay);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Grid);
Vue.use(GridItem);

Vue.use(mavonEditor);

Vue.use(uploader)
Vue.use(EVueContextmenu)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
})

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
