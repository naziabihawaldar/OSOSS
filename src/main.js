import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import Vuetify from 'vuetify'
import router from './routes';
import VueRouter from 'vue-router';
import 'vuetify/dist/vuetify.min.css';
import * as axios from 'axios';
import VeeValidate from 'vee-validate';
import moment from 'moment';
import 'moment-timezone';
import store from './store';

require('./css/style.css');

Vue.config.productionTip = false

Vue.use(VeeValidate);
Vue.use(VueRouter)
Vue.use(Vuetify, {

  theme:{
    primary: "#124E8A",
    secondary: "#D1272D",
    accent: "#000",
    error: "#f44336",
    warning: "#ff9800",
    info: "#339999",
    success: "#4caf50",
    blend: "#ecf1f4",
    icon_color: "#bbbbc6"
  }

});

window.axios = axios;
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('access_token');

Vue.prototype.moment = moment

router.beforeEach(

  (to, from, next) => {
    if(to.matched.some(record => record.meta.forGuests)){
      if(localStorage.getItem('access_token') !== null) {
        next({
          name: 'login',
        })
      } else{
          if(!store.getters.get_access_token) {
              store.dispatch('storeUser', JSON.parse(localStorage.getItem('user')));
             }
          next()
      }
    }else if(to.matched.some(record => record.meta.forUsers)){
      if(localStorage.getItem('access_token') === null){
        next({
          name: 'login',
        })
      }else next()

    }else next()

  }

);

window.axios.interceptors.response.use(null, function(error) {
  switch(error.response.status) {
      case 401:
          localStorage.removeItem('access_token');
          localStorage.removeItem('expiration');
          router.push({ name: 'login', query: {error: 'Session Expired'}});
          break;
      case 403:
        //
          break;
      case 404:
        //
          break;
      case 429:
        //
          break;
      default:
          break;
    }
  return Promise.reject(error);
});

Vue.mixin({
  methods: {

  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

