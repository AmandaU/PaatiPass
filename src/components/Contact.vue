<template>
  <div class="generalcontent">
    <h1>This is the contacts page</h1>
  </div>
</template>

<script>
   
   import { EventBus } from '../eventbus.js';
  

export default {
  name: 'contact',

  created() {
   EventBus.$emit('eventimageurl', '');
   },


}
</script>

<style lang="scss" scoped>
  @import "~@/styles/styles.scss";
 
  </style>
