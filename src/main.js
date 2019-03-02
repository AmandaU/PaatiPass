import Vue from 'vue';
import App from './App.vue';
import router from './router';
import 'vue-tel-input/dist/vue-tel-input.css';
import firebase from './firebase-config';
// import LoadScript from 'vue-plugin-load-script';
 
// Vue.use(LoadScript);

Vue.config.productionTip = false;

let app = ''
Vue.prototype.$eventHub = new Vue(); 

// created() {
//   firebase.initializeApp(
//     {
//       apiKey: "...",
//       authDomain: "....",
//       databaseURL: "..."
//       ...
//     }
//   )
// }
// }).$mount('#app')

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
   
    app = new Vue({
      router,
      render: h => h(App),
    }).$mount('#app');
    
  }
});
