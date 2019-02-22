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
  import CubeSpin from 'vue-loading-spinner/src/components/ScaleOut'
 
 export default {
    name: 'login',
    data() {
      return {
         busy: false,
        email: '',
        password: ''
      }
    },
     props: {
       shoppingcart: {
        type: Object,
        required: true // User can accept a userData object on params, or not. It's totally optional.
      }
  },

 created() {
   let img = this.shoppingcart? this.shoppingcart.event.imageurl:'';
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
           alert('Successful login');
            this.$eventHub.$emit('loggedin', '');
          if(self.$props.shoppingcart)
          {
            self.$props.shoppingcart.userid = user.user.uid;
            self.$router.replace({ name: 'Checkout', params: {shoppingcart: self.$props.shoppingcart}});
            self.busy = false;
          }
          else
          {
             self.$router.replace({ name: 'Home', params: {shoppingcart: self.$props.shoppingcart}});
          }
           
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