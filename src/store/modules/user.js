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
      noeFound = []
      menuApi.menuTree({userId: getters.userId}).then((res) => {
        let data = res.data;
        let mentTree = getMenuTree(data, []);
        console.log('mentTree', mentTree);
        state.menuList = mentTree.concat(noeFound);
        commit('SET_MENU_LIST',state.menuList);
        router.addRoutes(state.menuList)
        console.log('state.menuList', state.menuList)
        router.options.routes = router.options.routes.concat(state.menuList);
        console.log('router',router);
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

function getMenuTree(menuList, arr) {
  console.log('mentTreeData', menuList)
  arr = menuList.map((menu, index) => {
    let router = {}
    if(menu.children && menu.children.length){
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
  });
  return arr;
}

function findChildren(childrenMenu){
  let children = []
  childrenMenu.forEach((menu, index) => {
    if(menu.children && menu.children.length){
      if(!menu.component || menu.component.length === 0){
          menu.children.forEach(c => {
            let router = {}
            router.path = c.path
            router.name = c.name
            router.component = loadView(c.component)
            router.meta = {
              title: c.name,
              icon: c.icon
            }
            if(c.children && c.children.length){
              children = children.concat(findChildren(c.children, c))
              return
            }
            children.push(router)
          })
        return
      }
    }
    let router = {
      path: menu.path,
      name: menu.name,
      component: loadView(menu.component),
      meta: {title: menu.name, icon: menu.icon}
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

