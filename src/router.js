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
import Notify from './components/Notify.vue';
import VueTelInput from 'vue-tel-input'
import VueFire from 'vuefire'

Vue.use(VueFire)

Vue.use(VueTelInput)

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
      // meta: {
      //   requiresAuth: true,
      // },
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
      // meta: {
      //   requiresAuth: true,
      // },
    },
    {
    path: '/event',
    name: 'Event',
    component: Event, //() => import(/* webpackChunkName: "about" */ './views/About.vue'),
    // meta: {
    //   requiresAuth: true,
    // },
    props: true,
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
      path: '/success',
      name: 'Success',
      component: Success,//() => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },     
    {
      path: '/Cancel',
      name: 'Cancel',
      component: Cancel,//() => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },     
    {
      path: '/notify',
      name: 'Notify',
      component: Notify,//() => import(/* webpackChunkName: "about" */ './views/About.vue'),
      meta: {
        requiresAuth: true,
      },
      props: true,
    },        
  ],
});

router.beforeEach((to, from, next) => {
debugger;
 var thing = window.location.hash;
  if(thing != null)
  {
    var n = thing.indexOf("id=");
    if(n > -1)
    {
      let myticketId = thing.substring(n, thing.length - n);
      replace({ name: to.name, params: {ticketid: myticketId}});
    }
   
  }
  const currentUser = firebase.auth().currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !currentUser)
    next('login');
  // else if (!requiresAuth && currentUser)
  //   next('home');
  else
    next();
});

export default router;

Vue.use(Router);