import Vue from 'vue';
import App from './App.vue';
import router from './router';
import 'vue-tel-input/dist/vue-tel-input.css';
import firebase from './firebase-config';

Vue.config.productionTip = false;

let app = ''
window.EventBus = new Vue()
firebase.auth().onAuthStateChanged(() => {
  if (!app) {
   
    app = new Vue({
      router,
      render: h => h(App),
    }).$mount('#app');
    
  }
});
