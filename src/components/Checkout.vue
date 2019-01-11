<template>
  <div class="hello">
     <cube-spin v-if="busy"></cube-spin>
    <h1>Check out:</h1>
   <h1>{{ ticketdata.eventname }}</h1>
   <h1>R {{ ticketdata.total }}</h1>
     <button @click="BuyTickets()" >Buy</button>
  </div>
</template>

<script>
 import CubeSpin from 'vue-loading-spinner/src/components/ScaleOut'
   import firebase from '../firebase-config';
   import {  db } from '../firebase-config';

  let myEventsRef = db.ref('events')

export default {
  name: 'checkout',
  components: {
      CubeSpin
    },
   props: {
       ticketdata: {
        type: Object,
        required: true // User can accept a userData object on params, or not. It's totally optional.
      },
       pricebreakdata: {
        type: Object,
        required: true // User can accept a userData object on params, or not. It's totally optional.
      }
  },

  data() {
      return {
        busy: false,
            
      }
    },

 firebase () {
       let  eventid = String(this.$props.ticketdata.eventid) 
    return {
      tickets: db.ref('tickets'),
       events: myEventsRef,//myEventsRef, // loopable with v-for
       pricebreaks:  db.ref('pricebreaks').orderByChild("eventid").equalTo(eventid) ,
       }
      },

  methods: {
    
      BuyTickets() {

       this.busy = true;
      debugger;
 
        let pricebreak = this.$props.pricebreakdata;
        let ticket = this.$props.ticketdata;
        var key = pricebreak['.key'];
      
        let totalreserved  = String(Number(pricebreak.reserved) + Number(ticket.tickets));
        let sold  = String(Number(pricebreak.sold) + Number(ticket.tickets));
        this.$firebaseRefs.pricebreaks.child(key).child('reserved').set(totalreserved);
        this.$firebaseRefs.pricebreaks.child(key).child('sold').set(sold);
        ticket.price = pricebreak.price;
        this.$firebaseRefs.tickets.push(ticket)

        this.busy = false;
     
      },
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/styles.scss";
  </style>