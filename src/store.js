import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  	visitor_image: '',
    user:{},
    office:{},
    floor:{},
  },
  getters: {
    visitor_image: (state) => state.visitor_image,
    get_user:(state) =>state.user,
    get_office:(state)=>state.office,
    get_floor:(state)=>state.floor
  },
  mutations: {
  	updateImage(state, image) {
        state.visitor_image = image;
  	},
    removeImage(state) {
      state.visitor_image = '';
    },
    storeUser(state,user) {
      state.user = user;
    },
    removeUser(state) {
      state.user = {};
    },
    storeOffice(state,office) {
      state.office = office;
    },
    storeFloor(state,floor) {
        state.floor = floor;
      },

  },
  actions: {
    clearImage({commit}) {
      commit('removeImage');
    },
  	updateImage ({commit}, image) {
  		return new Promise((resolve, reject) => {
	      	commit('updateImage', image);
	      	resolve();
	    })
    },
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
    updateOffice ({commit}, image) {
      return new Promise((resolve, reject) => {
        commit('updateOffice', office);
        resolve();
      })
    },
    storeOffice({commit}, office) {
      return new Promise((resolve, reject) => {
        commit('storeOffice', office);
        resolve();
      });
    },
    updateFloor ({commit}, image) {
      return new Promise((resolve, reject) => {
        commit('updateFloor', floor);
        resolve();
      })
    },
    storeFloor({commit}, floor) {
      return new Promise((resolve, reject) => {
        commit('storeFloor', floor);
        resolve();
      });
    },
  }
})
