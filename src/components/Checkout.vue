<template>
  <div class="checkout">
  </div>
</template>

<script>
  //  import firebase from '../firebase-config';
  //  import {  db } from '../firebase-config';

  //  let myEventsRef = db.ref('events')

export default {
  name: 'checkout',
  
   props: {
       ticketdata: {
        type: Object,
        required: true // User can accept a userData object on params, or not. It's totally optional.
      }
  },

  data() {
      return {
       
        busy: false,
       
      }
    },

//  firebase () {
//     let  pricebreakid = String(this.$props.ticketdata.pricebreakid) 
//     return {
//       tickets: db.ref('tickets'),
//        events: myEventsRef,//myEventsRef, // loopable with v-for
//        eventsObj: { // can use keys, but v-for doesn't loop
//         source: myEventsRef,
//         asObject: true
//         },
//        pricebreak:  db.ref('pricebreaks').orderByChild("id").equalTo(pricebreakid) ,
//        pricebreaksObj: { // can use keys, but v-for doesn't loop
//         source: db.ref('pricebreaks').orderByChild("eventid").equalTo(eventidd),
//         asObject: true
//         },
//        }
//       },
  // methods: {
    
  //     BuyTickets: function() {

  //      this.busy = true;
        
  //       var key = this.pricebreak['.key'];
      
  //     //ToDo -- pay . If success , persist ticket, if not, fetch lates reserved amount and decrease

  //       totalreserved  = String(Number(pricebreak.reserved) + Number(this.ticket.tickets));
  //       let sold  = String(Number(pricebreak.sold) + Number(this.ticket.tickets));
  //       this.$firebaseRefs.pricebreaks.child(key).child('reserved').set(totalreserved);
  //       this.$firebaseRefs.pricebreaks.child(key).child('sold').set(sold);
  //       this.ticket.price = pricebreak.price;
  //       this.$firebaseRefs.tickets.push(this.ticket)
     
  //     },
  //}
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/styles.scss";
  </style>