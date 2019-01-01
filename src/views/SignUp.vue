<template>
  <div class="signup" >
    <p>Let's create a new account !</p>
    <input type="text" v-model="newUser.firstname" placeholder="First name"><br>
    <input type="text" v-model="newUser.surname" placeholder="Surname"><br>
    <input type="text" v-model="newUser.email" placeholder="Email"><br>
    <input type="password" v-model="newUser.password" placeholder="Password"><br>
    <vue-tel-input class="tel"  v-model="newUser.cellphone"
                  @onInput="onInput"
                  :preferredCountries="['za']">
   </vue-tel-input><br>
    <button @click="signUp">Sign Up</button>
    <span>or go back to <router-link to="/login">login</router-link>.</span>
  
  </div>
</template>

 <script>

   import firebase from '../firebase-config';
   import {  db } from '../firebase-config';

   let myUsersRef = db.ref('users')

 export default {
    name: 'signUp',
    data() {
      return {

        newUser: {
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

      insert(){
        debugger;
           myUsersRef.push(this.newUser);
            this.newUser.firstname = '',
            this.newUser.surname = '',
            this.newUser.surname = '',
            this.newUser.email = '',
            this.newUser.cellphone = '',
       
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
        firebase.auth().createUserWithEmailAndPassword(this.newUser.email, this.newUser.password).then(
          (user) => {
              alert('Your account has been created')
              this.insert();
            this.$router.replace('login')
          },
          (err) => {
            alert('Oops. ' + err.message)
          }
        );
      }
    }
  };
</script>

 <style scoped>

 .tel {
   margin:0 auto;
    width: 20%;
    align-items: center;
   justify-content: center;
   display: block;
  }

  .signup {
    margin-top: 40px;
  }
  input {
    margin: 10px 0;
    width: 20%;
    padding: 5px;
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