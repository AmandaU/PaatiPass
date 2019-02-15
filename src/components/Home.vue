<template>
  <div class="container">
     <cube-spin v-if="busy"></cube-spin>
      <div class="centreblock">
            <div  v-for="event in events" :key="event['.key']">
                <div class="imagebox">
                  <img v-bind:src="event.imageurl"  alt=""  /><br>
                   <div class="infobox">
                    <strong>{{event.name}}</strong><br>
                    <!-- <div v-html="eventVenue(event)"></div> -->
                      <small>The party is at {{event.venuename}}</small><br>
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
  </div>
</template>

<script>
   import firebase from '../firebase-config';
   import {  db } from '../firebase-config';
   import { EventBus } from '../eventbus.js';
  // import CubeSpin from 'vue-loading-spinner/src/components/ScaleOut'

export default {
  name: 'home',

  data() {
      return {
         busy: true,
        position: 'absolute'
      }
    },

firebase () {
        return {
        events: db.ref('events') 
        // events: {
        // source: db.ref('events') ,
        // // asObject: true,
        //   readyCallback: () =>   
        //   {
        //     debugger;
        //     this.position = this.events.length > 1? 'relative': 'absolute'
        //     EventBus.$emit('footerpositionchange', position);
        //     this.busy = false;
        // },
        // }
        }
      },

created() {
  EventBus.$emit('eventimageurl', '');
  
},
 
 mounted(){
 
 EventBus.$emit('footerpositionchange', this.position);
 }
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
