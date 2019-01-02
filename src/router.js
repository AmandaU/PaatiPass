import firebase from 'firebase';
import Vue from 'vue';
import Router from 'vue-router';
import Home from './components/Home.vue';
import Login from './components/Login.vue';
import SignUp from './components/SignUp.vue';
import About from './components/About.vue';
import Event from './components/Event.vue';
import Contact from './components/Contact.vue';
import VueTelInput from 'vue-tel-input'
import VueFire from 'vuefire'

Vue.use(VueFire)

Vue.use(VueTelInput)

const router = new Router({
  routes: [
    {
      path: '*',
      redirect: 'login',
    },
    {
      path: '/',
      redirect: 'login',
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/signup',
      name: 'SignUp',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: SignUp,
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      meta: {
        requiresAuth: true,
      },
    },
      {
        path: '/about',
        name: 'about',
        component: About,//() => import(/* webpackChunkName: "about" */ './views/About.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/contact',
        name: 'contact',
        component: Contact,//() => import(/* webpackChunkName: "about" */ './views/About.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      ,
      {
        path: '/event',
        name: 'event',
        component: Event,//() => import(/* webpackChunkName: "about" */ './views/About.vue'),
        meta: {
          requiresAuth: true,
        },
      },
  ],
});

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (requiresAuth && !currentUser)
    next('login');
  else if (!requiresAuth && currentUser)
    next('home');
  else
    next();
});

export default router;

Vue.use(Router);