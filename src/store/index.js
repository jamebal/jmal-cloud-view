// import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
  },
  getters,
  state: {
    message: null,
    fileClipboard: [],
    theme: 'light', // 'light' or 'dark'
  },
  mutations: {
    setMessage(state, message) {
      state.message = message;
    },
    setFileClipboard(state, fileClipboard) {
      state.fileClipboard = fileClipboard;
    },
    setTheme(state, theme) {
      state.theme = theme;
    }
  },
  actions: {
    updateMessage({ commit }, message) {
      commit('setMessage', message);
    },
    updateFileClipboard({ commit }, fileClipboard) {
      commit('setFileClipboard', fileClipboard);
    },
    updateTheme({ commit }, theme) {
      commit('setTheme', theme);
    }
  }
})

export default store
