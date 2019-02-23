<template>
  <div class="centralcontainer">
    <br> <br>
      <div class="centreblock">
        <cube-spin v-if="busy"></cube-spin>
            <div  v-for="event in events" :key="event['.key']">
              <div class="eventrow">

                  <div class="eventimagebox">
                    <img v-bind:src="event.imageurl"  alt=""  /><br>
                  </div>

                  <div class="eventinfobox">
                       <strong>{{event.name}}</strong><br>
                      <small>The party is at {{event.venuename}}</small><br>
                      <small>from {{event.from}} to {{event.to}}</small><br>
                      <small>{{event.venueaddress}}</small><br>
                  </div>
                      
                  <div class="eventbuttonbox">
                      <router-link :to="{ name: 'Event', params: { eventid: event.id}}">
                         <img src="../assets/rightarrow.jpg"  alt="About"  /><br>
                        <!-- <button >Buy</button> -->
                      </router-link>
                  </div>

                  <div class="thinline"></div>
      
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
  components: {
      CubeSpin
    },
  data() {
      return {
         busy: false,
        position: 'relative'
      }
    },

firebase () {
        return {
          events: db.ref('events') ,
          }
      },

created() {
  this.$eventHub.$emit('eventimageurl', '');
 },
 
//  mounted(){
 
//  EventBus.$emit('footerpositionchange', this.position);
//  }
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
