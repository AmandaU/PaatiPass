<template>
<div> 
  
  <nav class="nav" > 
    
    <div class="home hoveritem"  @click="navigate('Home')">Home
       <!-- <img src="../assets/home1.png"  alt=""  /><br> -->
    </div>
    <div class="menu">
     <!-- <div class="hoveritem"  v-on:click="navigate('About')" >About</div> -->
      <div class="hoveritem" v-show="!isLoggedin" v-on:click="navigate('Login')" >Login</div>
      <div class="hoveritem" v-show="!isLoggedin" v-on:click="navigate('Signup')" >Register</div>
      <!-- <div class="hoveritem"  v-on:click="navigate('Contact')" >Contact</div> -->
      <div class="hoveritem"  v-show="isLoggedin" v-on:click="navigate('Logout')" >Logout</div>
    <!-- <router-link class="hoveritem" v-for="routes in links" 
             v-bind:key="routes.id" 
             v-on:click="navigate('${routes.page}')"
            
             ></router-link> -->
    </div>
  </nav> 
</div>
</template>

<script>

 import firebase from '../firebase-config';

export default {
  name: 'Navigation',
data() {
    return {
    isLoggedin: false
    }
  },

firebase () {
      return {
       }
    },

computed:{

 },

created() {
  if(firebase.auth().currentUser)
  {
    this.isLoggedin = true;
  }
 },

 mounted() {
     let self = this;
  this.$eventHub.$on('loggedin', ()=> {
     self.isLoggedin = true;
  });
 },

methods: {
    navigate (navPath) {
      if(navPath == "Logout")
       {
         let self = this;
         firebase.auth().signOut().then(function() { 
          console.log('Signed Out');
           alert('You have successfully logged out');
            //this.$router.push({path: '/Home',})
            self.isLoggedin = false;
            self.$router.replace({ name: 'Home'});
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

.nav{
    background-color:white;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    z-index: 10;
    height:5vh;
}

.home {
  font-weight: 200;
  font-size: 20px;
  position: relative;
  text-align: left;
  left:20px;
  display: flex;
  float: left;
  padding-left: 10px;
  justify-content:center;
  align-content:center;
 
}

 .menu {
  position: relative;
  height:30px;
  width:120px;
  text-align: right;
  bottom: 0px;
  right:60;
  font-weight: 200;
  font-size: 20px;
  display: flex;
  float: right;
  padding-bottom: 5px;
  padding-right: 40px;
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
  }

  .hoveritem:hover {
    text-decoration:underline;
    cursor: pointer;
    }
</style>