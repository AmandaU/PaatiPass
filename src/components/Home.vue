<template>
  <div class="home">
    <div class="centreblock">
    <div v-for="event in events" :key="event['.key']">
  <div class="box">
              <p>
                <strong>{{event.name}}</strong>
                <br>
                 <small>{{event.address}}</small>
                <br>
                <router-link :to="{ name: 'Event', params: { eventdata: event}}">
                  <button id="myButton" class="foo bar">Buy</button>
                  </router-link>
               
              </p>
            </div>
            </div>
</div>
  </div>
</template>

<script>
   import firebase from '../firebase-config';
   import {  db } from '../firebase-config';

   let myEventsRef = db.ref('events')

export default {
  name: 'home',

  data() {
      return {
        events: [],
        busy: false,
        event: {
          id: '',
          name: '',
          address: '',
        }
      }
    },

firebase () {
        return {
          events: myEventsRef    
        }
      },

  methods: {
      
  },
  
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/styles.scss";
  </style>
