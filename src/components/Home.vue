<template>
  <div class="home">
     <cube-spin v-if="busy"></cube-spin>
      <div class="centreblock">
            <div  v-for="event in events" :key="event['.key']">
                <div class="box">
                    <strong>{{event.name}}</strong><br>
                    <!-- <div v-html="eventVenue(event)"></div> -->
                      <medium>The party is at {{event.venuename}}</medium><br>
                      <small>from {{event.from}} to {{event.to}}</small><br>
                      <small>{{event.venueaddress}}</small><br>
                      <!-- <small>{{event.venuelatlong}}</small><br> -->
                      <router-link :to="{ name: 'Event', params: { eventdata: event}}">
                        <button id="myButton" class="foo bar">Buy</button>
                      </router-link>
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
  name: 'home',

  data() {
      return {
        events: [],
        venues: {},
        busy: true,
      }
    },

firebase () {
        return {
          events: db.ref('events')  ,
        }
      },

  // created(){
      
  //         this.$bindAsObject(
  //           "venues",
  //           db.ref('venues'),
  //           null,
  //           () => {
  //             // events Ready Callback
  //                this.$bindAsArray(
  //                 "events",
  //                 db.ref('events'),
  //                 null,
  //                 () => {
  //                   // venues Ready Callback
  //                   // console.log(`all calls done`)
  //                   this.busy = false;
  //                 }
  //               );

  //             }
  //         );
  //  },

}
</script>

<style lang="scss" scoped>
  @import "~@/styles/styles.scss";
  </style>
