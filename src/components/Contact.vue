<template>
  <div class="generalcontent">
    <h1>This is the contacts page</h1>
  </div>
</template>

<script>
 
export default {
  name: 'contact',

  created() {
   this.$eventHub.$emit('eventimageurl', '');
   },


}
</script>

<style lang="scss" scoped>
  @import "~@/styles/styles.scss";
 
  </style>
