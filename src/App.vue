<template>
  <div id="app">
   <div height="20vh" >
     <div class="wrapper">
       <img alt="Vue logo" :src="imageurl" class="image">
        <Navigation class="navigation"></Navigation>
    
      </div>
   </div>
   
    <router-view/>
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
   
          this.imageurl = imageurl;
  })
},
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/styles.scss";
  </style>