// import Vue from 'vue'
// import Router from 'vue-router'

Vue.use(VueRouter)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/login_m',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/s/:id',
    name: 'share',
    component: () => import('@/views/public/share/shareList')
  },
  {
    path: '/b',
    name: 'CreateBurnNote',
    component: () => import('@/views/public/burnNote/CreateBurnNote.vue'),
  },
  {
    path: '/b/:id',
    name: 'ViewBurnNote',
    component: () => import('@/views/public/burnNote/ViewBurnNote.vue'),
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

export const dynamicRouters = [
  {
    path: '/_m',
    component: Layout,
    redirect: '/home_m',
    children: [{
      path: '',
      name: 'Home_m',
      component: () => import('@/views/home/mobile/index'),
      meta: { title: '所有文件' }
    }]
  },
  {
    path: '/upload/index_m',
    component: Layout,
    redirect: '/upload/index_m',
    children: [{
      path: '',
      name: 'Home_m',
      component: () => import('@/views/upload/mobile/index'),
      meta: { title: '文件传输' }
    }]
  },
  {
    path: '/tag',
    component: Layout,
    children: [
      {
        path: '',
        name: 'tag',
        component: () => import('@/views/tag/index'),
        meta: { title: '标签', menuType: 0, keepAlive: false }
      }
    ]
  }
]

const createRouter = () => new VueRouter({
  mode: 'history', // require service support
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter(params) {
  router.options.routes = []
  const newRouter = createRouter()
  if(params){
    newRouter.addRoutes(params)
  }
  newRouter.addRoutes(dynamicRouters)
  router.matcher = newRouter.matcher // reset router
}
router.addRoutes(dynamicRouters)
export default router
