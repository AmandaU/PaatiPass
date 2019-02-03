<template>
  <div class="signup" >
    <cube-spin v-if="busy"></cube-spin>
    <p>Let's create a new account !</p>
    <input type="text" v-model="newUser.firstname" placeholder="First name"><br>
    <input type="text" v-model="newUser.surname" placeholder="Surname"><br>
    <input type="text" v-model="newUser.email" placeholder="Email"><br>
    <input type="password" v-model="newUser.password" placeholder="Password"><br>
    <vue-tel-input class="tel"  v-model="newUser.cellphone"
                  @onInput="onInput"
                  :preferredCountries="['za']">
   </vue-tel-input><br>
    <button @click="signUp" >Sign Up</button>
    <p>or go back to <span @click="goBackToLogin()" style="color:blue;cursor:pointer">login</span>
         </p>
    
  </div>
</template>

 <script>

   import CubeSpin from 'vue-loading-spinner/src/components/ScaleOut'
   import firebase from '../firebase-config';
   import {  db } from '../firebase-config';

   let myUsersRef = db.ref('users')

 export default {
    name: 'signup',
    components: {
      CubeSpin
    },
     props: {
       shoppingcart: {
        type: Object,
        required: true // User can accept a userData object on params, or not. It's totally optional.
      }
  },
    data() {
      return {
        busy: false,
        newUser: {
          uid: '',
          firstname: '',
          surname: '',
          email: '',
          password: '',
          cellphone: '',
        }
      }
    },

   firebase () {
        return {
          myusers: myUsersRef    
        }
      },
    methods: {
      
      goBackToLogin ()
      {
       this.$router.replace({ name: 'Login', params: {shoppingcart: this.$props.shoppingcart}});
      },

       logout: function() {
      firebase.auth().signOut().then(() => {
        this.$router.replace('login')
      })
    },

    insert(uid){
      debugger;
      this.newUser.uid = uid;
          myUsersRef.push(this.newUser);
          this.newUser.firstname = '',
          this.newUser.surname = '',
          this.newUser.email = '',
          this.newUser.cellphone = '',
          this.newUser.uid = '',
          this.busy = false;
      alert("Succeessfully added")
  },
  remover(userUID){
     this.$firebaseRefs.users.child(userUID).remove()
  },

      onInput({ number, isValid, country }) {
      this.cellphone = number;
       console.log(number, isValid, country);
     },

      signUp: function() {
        
        this.busy = true;
       
        firebase.auth().createUserWithEmailAndPassword(this.newUser.email, this.newUser.password).then(
          (user) => {
            const currentUser = firebase.auth().currentUser;
              alert('Your account has been created')
              debugger;
              this.insert(currentUser.uid);
              this.$router.replace({ name: 'Checkout', params: {ticketdata: this.$props.ticketdata, pricebreakdata: this.$props.pricebreakdata}});
           
          },
          (err) => {
            alert('Oops. ' + err.message)
            this.busy = false;
          }
        );
      }
    }
  };
</script>

 <style lang="scss" scoped>
  @import "~@/styles/styles.scss";
  </style>