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
    fileClipboard: []
  },
  mutations: {
    setMessage(state, message) {
      state.message = message;
    },
    setFileClipboard(state, fileClipboard) {
      state.fileClipboard = fileClipboard;
    }
  },
  actions: {
    updateMessage({ commit }, message) {
      commit('setMessage', message);
    },
    updateFileClipboard({ commit }, fileClipboard) {
      commit('setFileClipboard', fileClipboard);
    }
  }
})

export default store
