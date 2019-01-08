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
    <span>or go back to <router-link to="/login">login</router-link>.</span>
  
  </div>
</template>

 <script>

   import CubeSpin from 'vue-loading-spinner/src/components/ScaleOut'
   import firebase from '../firebase-config';
   import {  db } from '../firebase-config';

   let myUsersRef = db.ref('users')

 export default {
    name: 'signUp',
    components: {
      CubeSpin
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
            this.$router.replace('login')
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

 <style scoped>

 .tel {
    margin:0 auto;
    width: 21%;
    align-items: center;
   justify-content: center;
   display: flex;
  
  
  }

  .signup {
    margin-top: 40px;
  }
  input {
    margin: 10px 0;
    width: 20%;
    padding: 7px; 
    
  }
  button {
    margin-top: 10px;
    width: 10%;
    cursor: pointer;
  }
  span {
    display: block;
    margin-top: 20px;
    font-size: 11px;
  }
</style>