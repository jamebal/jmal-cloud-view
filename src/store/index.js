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
    uploaderState: null,
  },
  mutations: {
    setMessage(state, message) {
      state.message = message;
    },
    setUploaderState(state, uploaderState) {
      state.uploaderState = uploaderState;
    },
  },
  actions: {
    updateMessage({ commit }, message) {
      commit('setMessage', message);
    },
    updateUploaderState({ commit }, uploaderState) {
      commit('setUploaderState', uploaderState);
    },
  }
})

export default store
