import Vue from 'vue';
import App from './App.vue';
import router from './router';
import firebase from './firebase-config';
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios);
Vue.config.productionTip = false;

let app = ''
Vue.prototype.$eventHub = new Vue(); 

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
   
    app = new Vue({
      router,
      render: h => h(App),
    }).$mount('#app');
    
  }
});
