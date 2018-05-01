import Vue from 'vue'
import Vuetify from 'vuetify';
import App from './App';
//import VueRouter from 'vue-router';
import axios from 'axios';
import VueLocalStorage from 'vue-localstorage';
import Vuex from 'vuex';
import {config, store} from './components/config';
import('../node_modules/vuetify/dist/vuetify.min.css') // Ensure you are using css-loader
axios.defaults.baseURL = 'http://127.0.0.1:8000/controle-list/';
axios.defaults.headers.common['Accept'] = 'application/json';
//axios.defaults.headers.common['Origin'] = 'http://127.0.0.1:8000'
axios.defaults.headers.post['Content-Type'] = 'application/json';



Vue.use(Vuetify);
Vue.use(VueLocalStorage);
//Vue.localStorage.set('token', null);
config.localstore = Vue.localStorage;

Vue.config.productionTip = false;
Vue.use(Vuetify);
//Vue.use(VueRouter);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store: store,
  template: '<App/>',
  components: { App }
})
