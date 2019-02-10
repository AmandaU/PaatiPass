<template>
  <div id="app">
   <div class="fullpage" >
     <div class="banner">
       <div class="row">
          <div class="column left" v-bind:style="{ 'background-image': 'url(' + imageurl + ')' }">
            <!-- <img alt="Vue logo" :src="imageurl" class="image"> -->
          </div>
          <div class="column middle" v-bind:style="{ 'background-image': 'url(' + imageurl + ')' }">
            <!-- <img alt="Vue logo" :src="imageurl" class="image"> -->
          </div>
          <div class="column right" v-bind:style="{ 'background-image': 'url(' + imageurl + ')' }">
            <!-- <img alt="Vue logo" :src="imageurl" class="image"> -->
          </div> 
       </div>
     </div>
   
     <Navigation ></Navigation>
      
     <router-view/>
    </div>
  </div>
</template>

<script>
import Navigation from './components/Navigation'
import { EventBus } from './eventbus.js';

export default {
  name: 'app',
  components: {
    'Navigation': Navigation
  },

  data: function () {
  return {
    
       imageurl: require('./assets/logo.png') ,
   }
  },

  mounted() {
   EventBus.$on('eventimageurl', imageurl => {
  
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
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/styles.scss";
  </style>