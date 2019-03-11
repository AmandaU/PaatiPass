import firebase from 'firebase';
import Vue from 'vue';
import Router from 'vue-router';
import Home from './components/Home.vue';
import Login from './components/Login.vue';
import Signup from './components/Signup.vue';
import About from './components/About.vue';
import Event from './components/Event.vue';
import Contact from './components/Contact.vue';
import Checkout from './components/Checkout.vue';
import Success from './components/Success.vue';
import Cancel from './components/Cancel.vue';
import ScanQR from './components/ScanQR.vue';
import VueTelInput from 'vue-tel-input'
import VueFire from 'vuefire'
import LoadScript from 'vue-plugin-load-script';

Vue.use(VueFire)

Vue.use(VueTelInput)

Vue.use(LoadScript);

const router = new Router({
  routes: [
    {
      path: '*',
      redirect: 'home',
    },
    {
      path: '/',
      redirect: 'home',
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      props: true,
      
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      props: true,
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup,
      props: true,
    },
    {
      path: '/about',
      name: 'About',
      component: About,//() => import(/* webpackChunkName: "about" */ './views/About.vue'),
      // meta: {
      //   requiresAuth: true,
      // },
    },
    {
      path: '/contact',
      name: 'Contact',
      component: Contact, //() => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
    {
    path: '/event/:eventid', 
    name: 'Event',
    component: Event, //() => import(/* webpackChunkName: "about" */ './views/About.vue'),
    }, 
    {
      path: '/checkout',
      name: 'Checkout',
      component: Checkout,//() => import(/* webpackChunkName: "about" */ './views/About.vue'),
      meta: {
        requiresAuth: true,
      },
      props: true,
    },  
    {
      path: '/success/:ticketref',
      name: 'Success',
      component: Success,//() => import(/* webpackChunkName: "about" */ './views/About.vue'),
      props: true,
      //test
      // props: (route) => ({
      //   ticketid: route.query.ticketid,
      //   ticketparam: ""
      // })
    },     
    {
      path: '/Cancel',
      name: 'Cancel',
      component: Cancel,//() => import(/* webpackChunkName: "about" */ './views/About.vue'),
      props: true,
    },     
    {
      path: '/scanqr',
      name: 'ScanQR',
      component: ScanQR,//() => import(/* webpackChunkName: "about" */ './views/About.vue'),
      meta: {
        requiresAuth: true, requiresAdmin:true
      },
    },        
  ],
});

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !currentUser)
    next('login');
  else{
    next();
  }
   
});

export default router;

Vue.use(Router);