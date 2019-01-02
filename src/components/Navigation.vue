<template>
<div> 
  <!-- <h2>Nav Bar</h2>  -->
  <nav> 

    <div class="menu">
    <div class="hoveritem"  v-on:click="navigate('about')" >About</div>
    <div class="hoveritem"  v-on:click="navigate('home')" >Home</div>
    <div class="hoveritem"  v-on:click="navigate('contact')" >Contact</div>
    <div class="hoveritem"  v-on:click="logout()" >Logout</div>
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
      links: [
        {
          id: 0,
          text: 'About',
          page:'/About'
        },
        {
          id: 1,
          text: 'Home',
          page:'/Home'
        },
        {
          id: 2,
          text: 'Contact',
          page:'/Contact'
        },
        {
          id: 3,
          text: 'Logout',
          page:'/Login'
        }
      ]
    }
  },
methods: {

  logout: function() {
      firebase.auth().signOut().then(() => {
        this.$router.replace('login')
      })
    },

      navigate (navPath) {
       //debugger;
       if(navPath == "Logout")
       {
        logout();
       }
       else
       {
        this.$router.push({path: navPath,})
       }
    }
}
}
</script>

<style> 

 .menu {
    position: relative;
    height:100px;
    width:120px;
    text-align: right;
    top: 0px;
    left:60;
   font-weight: 600;
   font-size: 20px;
   display: flex;
   float: left;
   padding-top: 15px;
   flex-direction:row; 

}
  .spacing { 
    Margin-right: 10px; 
  } 

  .hoveritem{
    background-color:transparent;
    color: rgb(26, 25, 25);
     position:relative;
    text-align: right;
    justify-content:center;
    align-content:center;
    padding: 5px;
    margin: 0px;
    font-weight: 100;
    font-size: 20px;
  }

  .hoveritem:hover {
    text-decoration:underline;
    cursor: pointer;
    }
</style>