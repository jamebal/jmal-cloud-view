import router from './router'
import store from './store'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
import { getToken } from '@/utils/auth' // 认证获取token
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress配置

const whiteList = ['/login','/s','/s_m','/share'] // 白名单

router.beforeEach(async(to, from, next) => {
  // 开始进度条
  NProgress.start()

  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // 确认用户是否已登录
  const hasToken = getToken()

  if (hasToken) {
    // 已登录的情况
    if (to.path === '/login') {
      // 登陆页面
      // 如果已登录，则重定向到主页
      setMenuList(next, { path: '/' })
      NProgress.done()
    } else {
      // 非登陆页面
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        // 存在用户信息
        setMenuList(next)
      } else {
        // 不存在用户信息
        try {
          // 获取用户信息
          await store.dispatch('user/getInfo')
          setMenuList(next)
        } catch {
          // 删除token，然后转到登录页面重新登录
          await store.dispatch('user/resetToken')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    // 没有登陆的情况
    if (whiteList.indexOf(to.path) !== -1) {
      //  没有token但是在白名单中，直接进入
      next()
    } else {
      // 其他没有token重定向到登录页面。
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

function setMenuList(next, to){
  if(store.getters.menuList.length === 0){
    store.dispatch('user/setMenuList').then(() => {
      if(window.location.pathname === '/login'){
        next({path: store.getters.menuList[0].path})
      } else {
        next({path: window.location.pathname})
      }
    })
  } else {
    next(to)
  }
}

router.afterEach(() => {
  // 完成进度条
  NProgress.done()
})
