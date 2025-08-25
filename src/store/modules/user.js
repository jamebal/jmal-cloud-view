import { login, logout, getInfo, verifyTotp, initVerifyTotp } from '@/api/user'
import fileApi from '@/api/file-api'
import menuApi from '@/api/menu'
import { setLogo } from '@/utils/logo'
import { resetRouter } from '@/router'
import router from '@/router'
import Layout from '@/layout'
import ParentView from '@/components/ParentView'
import { terminateSSE } from '@/sse/SSEClient'

const setState = (state) => {
  localStorage.setItem('store', JSON.stringify(state))
}

const getDefaultState = () => {
  const storeData = localStorage.getItem('store')
  let store = null
  if (storeData) {
    try {
      store = JSON.parse(storeData)
    } catch (e) {
      console.error('Failed to parse user state from localStorage, it might be corrupted:', e)
      localStorage.removeItem('store')
    }
  }
  return {
    token: store ? store.token  : '',
    shareToken: store ? store.shareToken  : '',
    shareId: store ? store.shareId  : '',
    name: store ? store.name  : '',
    showName: store ? store.showName : '',
    userInfo: {},
    avatar: store ? store.avatar : '',
    userId: store ? store.userId  : '',
    menuList: [],
    netdiskName: store ? store.netdiskName : '',
    netdiskLogo: store ? store.netdiskLogo : '',
    exactSearch: store ? store.exactSearch : false,
    newVersion: store ? store.newVersion : '',
    iframePreviewConfig: {}
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_SHARE_TOKEN: (state, token) => {
    state.shareToken = token
  },
  SET_SHARE_ID: (state, shareId) => {
    state.shareId = shareId
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_SHOW_NAME: (state, showName) => {
    state.showName = showName
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  },
  SET_MENU_LIST:(state,menuList) => {
    state.menuList = menuList;
  },
  SET_USER_INFO:(state,userInfo) => {
    state.userInfo = userInfo;
  },
  SET_NETDISK_NAME:(state,netdiskName) => {
    state.netdiskName = netdiskName;
  },
  SET_NETDISK_LOGO:(state,netdiskLogo) => {
    state.netdiskLogo = netdiskLogo;
  },
  SET_EXACT_SEARCH:(state,exactSearch) => {
    state.exactSearch = exactSearch;
  },
  SET_NEW_VERSION:(state,newVersion) => {
    state.newVersion = newVersion;
  },
  SET_IFRAME_PREVIEW:(state, iframePreviewConfig) => {
    state.iframePreviewConfig = iframePreviewConfig;
  }
}

const actions = {

  async setMenuList({ commit, state }) {
    return new Promise( (resolve,reject) => {
      menuApi.menuTree({userId: state.userId}).then((res) => {

        const index = res.data.findIndex((item) => item.path === '/setting/taskProgress')
        if (index > -1) {
          localStorage.setItem('taskProgressRole', "1")
        } else {
          localStorage.removeItem('taskProgressRole')
        }

        commit('SET_MENU_LIST', getMenuTree(res.data));
        resetRouter(state.menuList)
        router.options.routes = router.options.routes.concat(state.menuList);
        resolve(res)
      }).catch(error => {
        reject(error)
      });
    } )
  },

  // user login
  login({ commit }, userInfo) {
    const { username, password, rememberMe } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, rememberMe: rememberMe }).then(response => {
        const { data } = response
        if (data.mfaToken) {
          resolve(data)
        } else {
          commit('SET_TOKEN', data['jmal-token'])
          commit('SET_NAME', username.trim())
          commit('SET_USERID', data.userId)
          resolve()
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  verifyMfaCode({ commit }, loginForm) {
    const payload = { ...loginForm, username: loginForm.username.trim() };
    return new Promise((resolve, reject) => {
      verifyTotp(payload).then(response => {
        const { data } = response
        commit('SET_TOKEN', data['jmal-token'])
        commit('SET_NAME', payload.username)

        commit('SET_USERID', data.userId)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  initVerifyMfaCode({ commit }, loginForm) {
    const payload = { ...loginForm, username: loginForm.username.trim() };
    return new Promise((resolve, reject) => {
      initVerifyTotp(payload).then(response => {
        const { data } = response
        commit('SET_TOKEN', data['jmal-token'])
        commit('SET_NAME', payload.username)

        commit('SET_USERID', data.userId)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 验证提取码
  validShareCode({commit}, {shareId, shareCode}) {
    return new Promise((resolve, reject) => {
      fileApi.validShareCode({ shareId: shareId, shareCode: shareCode }).then(response => {
        const { data } = response
        commit('SET_SHARE_TOKEN', data)
        commit('SET_SHARE_ID', shareId)
        setState(state)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // set logo
  setLogo({ commit }, logoInfo) {
    const { netdiskName, netdiskLogo } = logoInfo
    commit('SET_NETDISK_NAME', netdiskName)
    commit('SET_NETDISK_LOGO', netdiskLogo)
    setLogo(netdiskName, netdiskLogo)
    setState(state)
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response
        if (!data) {
          // reject('Verification failed, please Login again.')
        }

        const { id, username, showName, avatar, netdiskName, exactSearch, netdiskLogo, newVersion, iframe} = data

        commit('SET_NAME', username)
        commit('SET_SHOW_NAME', showName)
        commit('SET_AVATAR', avatar)
        commit('SET_USERID', id)
        commit('SET_USER_INFO', data)
        commit('SET_NETDISK_NAME', netdiskName)
        commit('SET_NETDISK_LOGO', netdiskLogo)
        commit('SET_EXACT_SEARCH', exactSearch)
        if (iframe) {
          commit('SET_IFRAME_PREVIEW', JSON.parse(iframe))
        } else {
          commit('SET_IFRAME_PREVIEW', {})
        }
        if (newVersion) {
          commit('SET_NEW_VERSION', newVersion)
        } else {
          commit('SET_NEW_VERSION', '')
        }
        setLogo(netdiskName, netdiskLogo)
        setState(state)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        localStorage.removeItem('store')
        localStorage.removeItem('app')
        resetRouter()
        commit('RESET_STATE')
        terminateSSE()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      localStorage.removeItem('store')
      localStorage.removeItem('app')
      commit('RESET_STATE')
      resolve()
    })
  },

  // update token
  setToken({ commit }, jmalToken) {
    commit('SET_TOKEN', jmalToken)
  },

  // remove share token
  resetShareToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_SHARE_TOKEN', undefined)
      commit('SET_SHARE_ID', undefined)
      resolve()
    })
  }
}

function getMenuTree(menuList) {
  menuList = menuList.filter(menu => menu.menuType !== 1)
  return menuList.map(menu => {
    let router = {}
    if(menu.children && menu.children.length){
      router.meta = {title: menu.name, icon: menu.icon, menuType: menu.menuType}
      router.hidden = menu.hide
      router.children = findChildren(menu.children)
      router.menuType = menu.menuType
    }
    if(menu.component && menu.component.length > 0) {
      router.children = [
        {
          path: '',
          name: menu.name,
          component: loadView(menu.component),
          meta: {title: menu.name, icon: menu.icon, menuType: menu.menuType},
          hidden: menu.hide
        }
      ]
    }
    router.path = menu.path
    router.component = Layout
    router.menuType = menu.menuType
    return router
  })
}

function findChildren(childrenMenu){
  let children = []
  childrenMenu = childrenMenu.filter(menu => menu.menuType !== 1)
  childrenMenu.forEach(menu => {
    let router = {
      path: menu.path,
      name: menu.name,
      component: !menu.component || menu.component.length === 0 ? ParentView : loadView(menu.component),
      meta: {title: menu.name, icon: menu.icon, menuType: menu.menuType},
      hidden: menu.hide,
      menuType: menu.menuType
    }
    if(menu.children && menu.children.length){
      if(!menu.component || menu.component.length === 0){
        router.children = findChildren(menu.children)
      }
    }
    children = children.concat(router)
  })
  return children
}

export const loadView = (view) => {
  return (resolve) => require([`@/views${view}`], resolve)
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

