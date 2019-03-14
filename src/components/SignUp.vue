<template>
  <div class="signup" >
    <div class="centralcontainer" >
      <div class="centreblock">
          <cube-spin v-if="busy"></cube-spin>
          <div class="infoblock">
          <p>Let's create a new account !</p>
          <input type="text" v-model="newUser.firstname" placeholder="First name" class="infoblockitem"><br>
          <input type="text" v-model="newUser.surname" placeholder="Surname" class="infoblockitem"><br>
          <input type="text" v-model="newUser.email" placeholder="Email" class="infoblockitem"><br>
          <input type="password" v-model="newUser.password" placeholder="Password" class="infoblockitem"><br>
          <vue-tel-input class="tel"  v-model="newUser.cellphone"
                        @onInput="onInput"
                        :preferredCountries="['za']">
          </vue-tel-input><br>
          <button @click="signUp" class="infoblockitem">Sign Up</button>
          <p>or go back to <span @click="goBackToLogin()" style="color:blue;cursor:pointer">login</span></p>
        </div>
     </div>
   </div>
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
       ticketref: '',
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
          isAdmin: false
        }
      }
    },

   firebase () {
        return {
          myusers: myUsersRef    
        }
      },
created() {
  if(localStorage.getItem(this.$props.ticketref))
     {
        this.shoppingcart = JSON.parse(localStorage.getItem(this.$props.ticketref));
      }
  let img = this.shoppingcart? this.shoppingcart.event.imageurl:'';
   this.$eventHub.$emit('eventimageurl', img);
    },

    methods: {
      
      goBackToLogin ()
      {
       this.$router.replace({ name: 'Login', params: {ticketref: this.$props.shoppingcart.reference}});
      },

       logout: function() {
       firebase.auth().signOut().then(() => {
        this.$router.replace('login')
      })
    },

    insert(uid){
     
      this.newUser.uid = uid;
          myUsersRef.push(this.newUser);
          this.newUser.firstname = '',
          this.newUser.surname = '',
          this.newUser.email = '',
          this.newUser.cellphone = '',
          this.newUser.uid = '',
          this.newUser.isAdmin = false,
          this.busy = false;
      alert("Succeessfully added")
  },

  remove(userUID){
     this.$firebaseRefs.users.child(userUID).remove()
  },

  onInput({ number, isValid, country }) {
    this.cellphone = number;
    console.log(number, isValid, country);
  },

  signUp: function() {
    this.busy = true;
    let self = this;
  
    firebase.auth().createUserWithEmailAndPassword(this.newUser.email, this.newUser.password).then(
      (user) => {
          alert('Your account has been created')
           this.$eventHub.$emit('loggedin', '');
            if(self.$props.shoppingcart)
            {
              self.$props.shoppingcart.userid = uid;
              localStorage.setItem(self.shoppingcart.reference, JSON.stringify(self.shoppingcart));
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