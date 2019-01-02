<template>
  <div class="home">
    
    <!-- <button @click="logout">Logout</button> -->
  </div>
</template>

<script>
 import firebase from '../firebase-config';
   import {  db } from '../firebase-config';

   let myEventsRef = db.ref('events')

export default {
  name: 'home',
firebase () {
        return {
          myevents: myEventsRef    
        }
      },
  methods: {
    logout: function() {
      firebase.auth().signOut().then(() => {
        this.$router.replace('login')
      })
    }
  }
}
</script>