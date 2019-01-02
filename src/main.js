import Vue from 'vue';
import App from './App.vue';
import router from './router';
import 'vue-tel-input/dist/vue-tel-input.css';
import firebase from './firebase-config';

Vue.config.productionTip = false;

const config = {
  apiKey: 'AIzaSyDsxTsf_KCxsgiJC4dQpQlsM9gf7cvy5aE',
  authDomain: 'jayla-tickets.firebaseapp.com',
  databaseURL: 'https://jayla-tickets.firebaseio.com',
  projectId: 'jayla-tickets',
  storageBucket: 'jayla-tickets.appspot.com',
  messagingSenderId: '873814667748'
};
let app = ''

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    /* eslint-disable no-new */

  //  debugger;
    app = new Vue({
      router,
      render: h => h(App),
    }).$mount('#app');
  }
});
