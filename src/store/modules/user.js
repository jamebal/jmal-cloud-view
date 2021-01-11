import { login, logout, getInfo } from '@/api/user'
import menuApi from '@/api/menu'
import { getToken, setToken, getConsumerId, setConsumerId, removeToken, removeConsumerId , setRememberName, removeRememberName } from '@/utils/auth'
import { resetRouter } from '@/router'
import getters from "@/store/getters"
import router from '@/router'
import Layout from '@/layout'
import ParentView from '@/components/ParentView'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    showName: '',
    avatar: '',
    userId: getConsumerId(),
    menuList: []
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
  }
}

const actions = {

  async setMenuList({ commit, state }) {
    let noeFound = [];
    return new Promise( (resolve,reject) => {
      menuApi.menuTree({userId: getters.userId}).then((res) => {
        state.menuList = getMenuTree(res.data);
        commit('SET_MENU_LIST',state.menuList);
        router.addRoutes(state.menuList)
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
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        commit('SET_USERID', data.userId)
        setConsumerId(data.userId)
        if(rememberMe){
          setRememberName(username)
        } else {
          removeRememberName()
        }
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo({
        id: state.userId,
        token: state.token
      }).then(response => {
        const { data } = response
        if (!data) {
          // reject('Verification failed, please Login again.')
        }

        const { id, username, showName, avatar } = data

        commit('SET_NAME', username)
        commit('SET_SHOW_NAME', showName)
        commit('SET_AVATAR', avatar)
        commit('SET_USERID', id)
        sessionStorage.setItem('store', JSON.stringify(state))
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
        removeToken() // must remove  token  first
        removeConsumerId()
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      removeConsumerId()
      commit('RESET_STATE')
      resolve()
    })
  }
}

function getMenuTree(menuList) {
  return menuList.map(menu => {
    let router = {}
    if(menu.children && menu.children.length){
      router.meta = {title: menu.name, icon: menu.icon}
      router.children = findChildren(menu.children)
    }
    if(menu.component && menu.component.length > 0) {
      router.children = [
        {
          path: '',
          name: menu.name,
          component: loadView(menu.component),
          meta: {title: menu.name, icon: menu.icon}
        }
      ]
    }
    router.path = menu.path
    router.component = Layout
    return router
  })
}

function findChildren(childrenMenu){
  let children = []
  childrenMenu.forEach(menu => {
    let router = {
      path: menu.path,
      name: menu.name,
      component: !menu.component || menu.component.length === 0 ? ParentView : loadView(menu.component),
      meta: {title: menu.name, icon: menu.icon}
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

