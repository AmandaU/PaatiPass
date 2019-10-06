<template>
<div> 
  
  <nav class="nav" > 

    <div class="menu menuleft">
      <div class="hoveritem"  @click="navigate('Home')">Home</div>
      <div class="hoveritem"  @click="navigate('Merch')">Merch</div>
      <div class="hoveritem" v-show="isAdmin" v-on:click="navigate('ScanQR')" >Scan QR</div>
    </div>
    <div class="menu menuright">
      <div class="hoveritem" v-on:click="navigate('Promoter')" >Promoters</div>
      <div class="hoveritem" v-show="!isLoggedin" v-on:click="navigate('Login')" >Login</div>
      <div class="hoveritem" v-show="!isLoggedin" v-on:click="navigate('Signup')" >Register</div>
       <div class="hoveritem"  v-show="isLoggedin" v-on:click="navigate('Logout')" >Logout</div>
    </div>

  </nav> 
</div>
</template>

<script>

 import firebase from '../firebase-config';
 import {  db } from '../firebase-config';

export default {
  name: 'Navigation',
data() {
    return {
    isLoggedin: false,
    isAdmin: false,
    isPromoter: false,
    user: []
    }
  },

firebase () {
      return {
       }
    },

 mounted() {
    let self = this;
    this.$eventHub.$on('loggedin', ()=> {
      self.isLoggedin = true;
    });

    this.$eventHub.$on('isAdmin', (isadmin)=> {
      self.isAdmin = isadmin;
    });

     this.$eventHub.$on('isPromoter', (ispromoter)=> {
      self.isPromoter = ispromoter;
    });


   var user = firebase.auth().currentUser;
    if(user){
       this.isLoggedin = true;
      this.$bindAsArray(
                "users",
                db.ref('users').orderByChild("uid").equalTo(user.uid).limitToFirst(1),
                null,
                () => {
                  if(this.users[0].isAdmin)
                  {
                    this.isAdmin = true;
                  }
                  if(this.users[0].isPromoter)
                  {
                    this.isPromoter = true;
                  }
                });
    }
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
            self.$eventHub.$emit('isAdmin', false);
            self.$eventHub.$emit('isPromoter', false);
            self.$router.replace({ name: 'Home'});
           }, 
           function(error) {
              console.error('Sign Out Error', error); 
              });
       }

       if(navPath == 'Promoter')
           {
             if( this.isLoggedin)
             {
                this.$router.replace({ name: 'Promoter'});
             }else{
               this.$router.replace({ name: 'Login', params: {isPromoter: true}});
             }
           }
        else if(window.location.hash.length > 8 && window.location.hash.substring(2,7) == "event")
       {
         if(navPath == "Login" || navPath == "Signup")
         {
            this.$router.replace({ name: navPath, params: {eventid: window.location.hash.substring(9,9)}});
           
         }
         else{
           this.$router.replace({ name: navPath});
         }
       }
       else
       if(navPath == "Logout")
       {
         this.$router.replace({ name: 'Login'});
       }
       else
       {
         this.$router.replace({ name: navPath});
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

 .menu {
  position: relative;
  height:30px;
  width:auto;
  bottom: 0px;
  font-weight: 200;
  font-size: 20px;
  display: flex;
  padding-bottom: 5px;
  flex-direction:row; 
}

.menuleft{
 left:30;
 text-align: left;
 float: left;
 padding-left: 40px;
}

.menuright{
 right:30;
 text-align: right;
 float: right;
 padding-right: 40px;
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