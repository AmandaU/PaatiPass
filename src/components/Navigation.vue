<template>
<div> 
  
  <nav> 
    <div class="menu">
      <div class="hoveritem"  v-on:click="navigate('About')" >About</div>
      <div class="hoveritem"  v-on:click="navigate('Home')" >Home</div>
      <div class="hoveritem"  v-on:click="navigate('Contact')" >Contact</div>
      <div class="hoveritem"  v-on:click="navigate('Logout')" >Logout</div>
    <!-- <router-link class="hoveritem" v-for="routes in links" 
             v-bind:key="routes.id" 
             v-on:click="navigate('${routes.page}')"
            
             ></router-link> -->
    </div>
  </nav> 
</div>
</template>

<script>

import firebase from 'firebase';

export default {
  name: 'Navigation',
data() {
    return {
      
    }
  },

methods: {
    navigate (navPath) {
    
      if(navPath == "Logout")
       {
        firebase.auth().signOut().then(function() { 
          console.log('Signed Out');
           alert('You have successfully logged out');
          this.$router.replace({ name: 'Home'});
           }, 
           function(error) {
              console.error('Sign Out Error', error); 
              });
       }
       else
       {
         let gotopath = '/' + navPath;
         this.$router.push({path: gotopath,})
       }
    }
},
  
}
</script>

<style> 

 .menu {
  position: relative;
  height:30px;
  width:120px;
  text-align: right;
  bottom: 0px;
  left:60;
  font-weight: 200;
  font-size: 25px;
  display: flex;
  float: left;
  padding-bottom: 5px;
  padding-left: 10px;
  flex-direction:row; 
}
  .spacing { 
    Margin-right: 10px; 
  } 

  .hoveritem{
   
    background-color:transparent;
    color: rgb(65, 63, 63);
     position:relative;
    text-align: right;
    justify-content:center;
    align-content:center;
    padding: 5px;
   bottom:0;
    /* font-weight: 100;
    font-size: 20px; */
  }

  .hoveritem:hover {
    text-decoration:underline;
    cursor: pointer;
    }
</style>