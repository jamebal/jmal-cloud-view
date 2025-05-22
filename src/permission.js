import router from './router'
import store from './store'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress配置

const whiteList = ['/login','/s','/s/'] // 白名单

router.beforeEach(async(to, from, next) => {
  // 开始进度条
  NProgress.start()
  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // 确认用户是否已登录
  const hasToken = store.getters.token

  if (hasToken) {
    // 已登录的情况
    if (to.path === '/login') {
      // 登录页面
      // 如果已登录，则重定向到主页
      setMenuList(next, { path: '/' })
      NProgress.done()
    } else {
      // 非登录页面
      const hasGetUserInfo = store.getters.userInfo.username
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
          if (to.path === '/404') {
            next(`/login`)
          } else {
            next(`/login?redirect=${to.path}`)
          }
          NProgress.done()
        }
      }
    }
  } else {
    // 没有登录的情况
    if (hasWhiteList(to.path)) {
      //  没有token但是在白名单中，直接进入
      next()
    } else {
      // 其他没有token重定向到登录页面。
      if (window.location.pathname === '/404') {
        window.location.pathname = '/'
      }
      next(`/login?redirect=${window.location.pathname}`)
      NProgress.done()
    }
  }
})

function hasWhiteList(path) {
  for (let i = 0; i < whiteList.length; i++) {
    if (path.indexOf(whiteList[i]) !== -1) {
      return true
    }
  }
  return false
}

function setMenuList(next, to){
  if(store.getters.menuList.length === 0){
    store.dispatch('user/setMenuList').then((res) => {
      const to = window.location.pathname
      if(findPath(res.data, to)){
        next(window.location.pathname + window.location.search)
      } else {
        if(to.path !== '/s'){
          next(window.location.pathname + window.location.search)
        } else {
          next({path: store.getters.menuList[0].path})
        }
      }
    })
  } else {
    next(to)
  }
}

/***
 * 查找菜单里有没有该路径
 * @param menuList
 * @param to 该路径(当前路径)
 * @param parentPath
 * @returns {boolean}
 */
function findPath(menuList, to, parentPath){
  for( let i = 0; i < menuList.length; i++) {
    const menu = menuList[i]
    if(menu.menuType === 1){
      continue
    }
    if(menu.children && menu.children.length > 0){
      if(findPath(menu.children, to, menu.path)){
        return true
      }
    }
    if(parentPath){
      menu.path = parentPath + '/' + menu.path
    }
    if(menu.path === to) return true
  }
  return false
}

router.afterEach(() => {
  // 完成进度条
  NProgress.done()
})
