<template>
  <div class="login">
    <cube-spin v-if="busy"></cube-spin>
    <h3>Sign In</h3>
    <input type="text" v-model="email" placeholder="Email"><br>
    <input type="password" v-model="password" placeholder="Password"><br>
        <button @click="login">Connection</button>
       <p>You don't have an account ? You can 
          <span @click="goToSignup()" style="color:blue;cursor:pointer">create one</span>
         </p>
    </div>
</template>

<script>
 import firebase from 'firebase';
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
       ticketdata: {
        type: Object,
        required: true // User can accept a userData object on params, or not. It's totally optional.
      },
        pricebreakdata: {
        type: Object,
        required: true // User can accept a userData object on params, or not. It's totally optional.
      }
  },
  
    methods: {

      goToSignup ()
      {
       this.$router.replace({ name: 'Signup', params: {ticketdata: this.$props.ticketdata, pricebreakdata: this.$props.pricebreakdata}});
      },

      login: function() {

      this.busy = true;
      const ticket = this.$props.ticketdata;
      const pricebreak = this.$props.pricebreakdata;
       
      firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
        (user) => {
            alert('Successful login');
        
          this.$router.replace({ name: 'Checkout', params: {ticketdata: ticket, pricebreakdata: pricebreak}});
          this.busy = false;
        },
        (err) => {
          alert('Oops. ' + err.message);
          this.busy = false;
        }
        
      );
      }
    }
  }
</script>

<style scoped> 

   .login {
    margin-top: 40px;
   }
  input {
     margin: 10px 0;
     width: 20%;
     padding: 15px;
   }
   button {
     margin-top: 20px;
     width: 10%;
     cursor: pointer;
   }
   p {
     margin-top: 40px;
     font-size: 13px;
   }
   p a {
     text-decoration: underline;
     cursor: pointer;
   }
 </style>