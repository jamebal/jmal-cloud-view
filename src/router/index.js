import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

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
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: '',
      name: 'Home',
      component: () => import('@/views/home/index'),
      meta: { title: '所有文件', icon: 'ziyuan' }
    }]
  },
  {
    path: '/recently',
    component: Layout,
    redirect: '/recently',
    children: [
      {
        path: '',
        name: 'recently',
        component: () => import('@/views/recently/index'),
        meta: { title: '最近', icon: 'zuijinyuedu' }
      }
    ]
  },

  {
    path: '/favorite',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/favorite/index'),
        meta: { title: '收藏', icon: 'Favoritestarrate' }
      }
    ]
  },

  {
    path: '/share',
    component: Layout,
    children: [
      {
        path: '',
        name: 'share',
        component: () => import('@/views/share/index'),
        meta: { title: '分享', icon: 'gongxiangzhongxin' }
      }
    ]
  },

  {
    path: '/audio',
    component: Layout,
    redirect: '/audio',
    children: [
      {
        path: '',
        name: 'audio',
        component: () => import('@/views/fileType/audio'),
        meta: { title: '音乐', icon: 'audio' }
      }
    ]
  },
  {
    path: '/video',
    component: Layout,
    redirect: '/video',
    children: [
      {
        path: '',
        name: 'video',
        component: () => import('@/views/fileType/video'),
        meta: { title: '视频', icon: 'video' }
      }
    ]
  },
  {
    path: '/image',
    component: Layout,
    redirect: '/image',
    children: [
      {
        path: '',
        name: 'image',
        component: () => import('@/views/fileType/image'),
        meta: { title: '图片', icon: 'image' }
      }
    ]
  },
  {
    path: '/document',
    component: Layout,
    redirect: '/document',
    children: [
      {
        path: '',
        name: 'document',
        component: () => import('@/views/fileType/document'),
        meta: { title: '文档', icon: 'document' }
      }
    ]
  },
  // {
  //   path: '/demo',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'demo',
  //       component: () => import('@/views/demo/index'),
  //       meta: { title: 'demo', icon: 'example' }
  //     }
  //   ]
  // },

  {
    path: '/markdown',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'editor',
        name: 'markdown',
        component: () => import('@/views/markdown/index'),
        meta: { title: '创建文档', icon: 'md' }
      }
    ]
  },

  {
    path: '/articles/article',
    component: Layout,
    children: [
      {
        path: '',
        name: 'article',
        component: () => import('@/views/public/article/index'),
        hidden: true,
        meta: { keepAlive: false }
      }
    ]
  },
  {
    path: 'articles',
    component: Layout,
    hidden: true,
    children: [
      {
        path: `${document.location.protocol}//${window.location.host}/articles`,
        meta: { title: '关联博客', icon: 'link', keepAlive: false }
      }
    ]
  },
  {
    path: '/setting/user',
    component: Layout,
    children: [
      {
        path: '',
        name: 'setting-user',
        component: () => import('@/views/setting/user/tabs/cusomerInfo'),
        meta: { title: '个人信息' , icon: 'UserSettings'}
      }
    ]
  },
  {
    path: '/setting/manager-users',
    component: Layout,
    children: [
      {
        path: '',
        name: 'manager-users',
        component: () => import('@/views/setting/user/tabs/cusomerManager'),
        meta: { title: '用户管理' , icon: 'huaban'}
      }
    ]
  },
  {
    path: '/setting/website',
    component: Layout,
    name: 'website',
    meta: { title: '网站管理', icon: 'wangzhanguanli'},
    children: [
      {
        path: 'manager-articles',
        name: 'manager-articles',
        component: () => import('@/views/setting/articles/articlePageManager'),
        meta: { title: '文章' , icon: 'guanlizhuanjiawenzhang'}
      },
      {
        path: 'manager-alone-page',
        name: 'manager-alone-page',
        component: () => import('@/views/setting/articles/alonePageManager'),
        meta: { title: '独立页面' , icon: 'guanlizhuanjiawenzhang'}
      },
      {
        path: 'manager-blog',
        name: 'manager-blog',
        component: () => import('@/views/setting/articles/blogManager'),
        meta: { title: '外观' , icon: 'pifu'}
      },
      {
        path: 'manager-categories',
        name: 'manager-categories',
        component: () => import('@/views/setting/articles/categoryManager'),
        meta: { title: '分类', icon: 'fenlei' }
      },
      {
        path: 'manager-tags',
        name: 'manager-tags',
        component: () => import('@/views/setting/articles/tagManager'),
        meta: { title: '标签', icon: 'biaoqian' }
      }
    ]
  },
  // {
  //   path: '/setting/manager-categories',
  //   component: Layout,
  //   children: [
  //     {
  //       path: '',
  //       name: 'manager-categories',
  //       component: () => import('@/views/setting/articles/categoryManager'),
  //       meta: { title: '分类管理', icon: 'leimupinleifenleileibie' }
  //     }
  //   ]
  // },
  {
    path: '/setting/manager-cloud',
    component: Layout,
    children: [
      {
        path: '',
        name: 'manager-cloud',
        component: () => import('@/views/setting/cloudManager'),
        meta: { title: '网盘管理', icon: 'yunshezhi' }
      }
    ]
  },
  {
    path: '/articles',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '',
        name: 'articles',
        component: () => import('@/views/public/articles/index'),
        meta: { title: '文档列表', icon: 'md-list', keepAlive: false }
      }
    ]
  },
  {
    path: '/s',
    component: Layout,
    children: [
      {
        path: '',
        name: 's',
        component: () => import('@/views/public/share/shareList'),
      }
    ]
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
    path: '/s_m',
    component: Layout,
    children: [
      {
        path: '',
        name: 's_m',
        component: () => import('@/views/public/share/shareList_m'),
      }
    ]
  },
  {
    path: '/demo',
    component: Layout,
    children: [
      {
        path: 'index_m',
        name: 'demo_m',
        component: () => import('@/views/demo/index_m'),
        meta: { title: 'demo', icon: 'example' }
      }
    ]
  },
  {
    path: '/upload',
    component: Layout,
    children: [{
      path: 'index_m',
      name: 'upload_m',
      component: () => import('@/views/upload/mobile/index'),
      meta: { title: '上传文件列表' }
    }]
  },
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  // scrollBehavior (to, from, savedPosition) {
  //   if (savedPosition) {
  //     return savedPosition
  //   } else {
  //     return { x: 0, y: 0 }
  //   }
  // },
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  newRouter.addRoutes(dynamicRouters)
  router.matcher = newRouter.matcher // reset router
}
router.addRoutes(dynamicRouters)
export default router
