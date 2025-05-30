import Cookies from 'js-cookie'


const getDefaultState = () => {

  const appData = localStorage.getItem('app')
  let app = null
  if (appData) {
    try {
      app = JSON.parse(appData)
    } catch (e) {
      console.error('Failed to parse app state from localStorage, it might be corrupted:', e)
      localStorage.removeItem('app')
    }
  }

  return {
    sidebar: {
      opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
      withoutAnimation: false
    },
    device: 'desktop',
    lang: app ? app.lang : undefined
  }
}

const state = getDefaultState()

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_LANG: (state, lang) => {
    state.lang = lang
  }
}

function setStorage() {
  localStorage.setItem('app', JSON.stringify(state))
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
    setStorage()
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
    setStorage()
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
    setStorage()
  },
  setLang({ commit }, lang) {
    commit('SET_LANG', lang)
    setStorage()
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
