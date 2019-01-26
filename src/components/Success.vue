<template>
  <div class="success">
    <h1>Your payment was successful</h1>
     <div  v-for="ticket in tickets" :key="ticket['.key']">
      <p>{{setBuyer(user)}}</p>
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
        ticket: '',
        tickets: [],
        busy: false,
       
      }
    },

     props: {
       ticketdata: {
        
        required: true // User can accept a userData object on params, or not. It's totally optional.
      }
  },

firebase () {

   let  eventid = String(this.$props.ticketdata.eventid) ;
        return {
           tickets: db.ref('tickets').orderByChild("reference").equalTo(ticketid).limitToFirst(1) ,
        }
      },

  methods: {

    setTicket (ticket)
    {
      this.ticket = ticket;

      UpdateData();
    },

     UpdateData()
      {
        
        let pricebreak =  db.ref('pricebreaks').orderByChild("eventid").equalTo(this.ticket.eventid) ;
        
        let key = pricebreak['.key'];
        let sold  = String(Number(pricebreak.sold) + Number(this.ticket.tickets));

         self.$firebaseRefs.pricebreaks.child(key).child('sold').set(sold);
          
      }
      
  },
  
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/styles.scss";
  </style>
