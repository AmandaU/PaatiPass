<template>
  <div id="app">
    <Navigation ></Navigation>
    <div class="fullpage" >
        <div class="banner">
            <div class="row">
              <div class="column" v-bind:style="{ 'background-image': 'url(' + imageurl + ')' }"></div>
              <!-- <div class="column left" v-bind:style="{ 'background-image': 'url(' + imageurl + ')' }"></div>
              <div class="column middle" v-bind:style="{ 'background-image': 'url(' + imageurl + ')' }"></div>
              <div class="column right" v-bind:style="{ 'background-image': 'url(' + imageurl + ')' }"></div>  -->
            </div>
        </div>
       <keep-alive include="Event">
        <router-view />
        </keep-alive>
       
      <BottomNav></BottomNav>
    </div>
     
  </div>
</template>

<script>
import BottomNav from './components/BottomNav'
import Navigation from './components/Navigation'
//import { EventBus } from './eventbus.js';

export default {
  name: 'app',
  components: {
    'Navigation': Navigation,
    'BottomNav': BottomNav
  },

  data: function () {
  return {
    imageCount: 3,
       imageurl: require('./assets/logo.png') ,
   }
  },

  mounted() {

    this.$eventHub.$on('eventimageurl', imageurl => {
  
   if(imageurl == '')
   {
         this.imageurl = require('./assets/logo.png'); 
   }
   else
   {
     this.imageurl = imageurl;
   }
  })
},

beforeDestroy: function() {
    // Clean up
    this.$eventHub.$off('eventimageurl', '');
    
  },
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/styles.scss";
  </style>