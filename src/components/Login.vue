<template>
  <div class="login">
    <div class="centralcontainer" >
       <div class="centreblock">
        <cube-spin v-if="busy"></cube-spin>
        <br>
        <div class="infoblock">
         <h3>Sign In</h3>
        <input type="text" v-model="email" placeholder="Email"  class="infoblockitem"><br>
        <input type="password" v-model="password" placeholder="Password"  class="infoblockitem"><br>
        <button @click="login" class="infoblockitem">Login</button>
        <p>You don't have an account ? You can 
          <span @click="goToSignup()" style="color:blue;cursor:pointer">create one</span>
         </p>
         </div>
 </div>
           </div>
    </div>
</template>

<script>
  import firebase from '../firebase-config';
  import {  db } from '../firebase-config';
  import CubeSpin from 'vue-loading-spinner/src/components/ScaleOut'
 
 export default {
    name: 'login',
    data() {
      return {
         busy: true,
        email: "",
        password: "",
        users: []
      }
    },
     props: {
       eventid: '',
       shoppingcart: {
        type: Object,
        required: true // User can accept a userData object on params, or not. It's totally optional.
      }
  },

 created() {
    let img = this.shoppingcart.event? this.shoppingcart.event.imageurl:'';
    this.$eventHub.$emit('eventimageurl', img);
    },

   
 methods: {

      goToSignup ()
      {
       this.$router.replace({ name: 'Signup', params: {shoppingcart: this.$props.shoppingcart}});
      },
    
    login: function() {
      
     this.busy = true;
       let self = this;
      firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
        (user) => {
          let uid = user.user.uid;
          alert('Successful login');
          self.$eventHub.$emit('loggedin', '');
          self.$bindAsArray(
                  "users",
                 db.ref('users').orderByChild("uid").equalTo(uid).limitToFirst(1),
                  null,
                  () => {
                    if(self.users[0].isAdmin)
                    {
                      self.$eventHub.$emit('isAdmin', '');
                    }

                    if(self.$props.shoppingcart)
                    {
                      self.$props.shoppingcart.userid = uid;
                      self.$router.replace({ name: 'Checkout', params: {shoppingcart: self.$props.shoppingcart}});
                      self.busy = false;
                    }
                    else if(self.$props.eventid)
                    {
                      self.$router.replace({ name: 'Event', params: {eventid: self.$props.shoppingcart}});
                     
                    }
                    else
                    {
                      self.$router.replace({ name: 'Home'});
                    }
                  }
                );
           
        },
        (err) => {
          alert('Oops. ' + err.message);
          self.busy = false;
        }
      );
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/styles/styles.scss";
</style>