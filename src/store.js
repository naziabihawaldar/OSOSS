import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user:{},
  },
  getters: {
    get_user:(state) =>state.user,

  },
  mutations: {

    storeUser(state,user) {
      state.user = user;
    },
    removeUser(state) {
      state.user = {};
    },


  },
  actions: {


    storeUser({commit}, user) {
      return new Promise((resolve, reject) => {
          commit('storeUser', user);
          resolve();
      });
    },
    removeUser({commit}) {
      return new Promise((resolve, reject) => {
          commit('removeUser');
          resolve();
      });
    },


  }
})
