<template>
  <div class="cancel">
    <h1>Your payment was been successfully cancelled</h1>
    <div  v-for="ticket in tickets" :key="ticket['.key']">
      <p>{{setTicket(ticket)}}</p>
    </div>
  </div>
</template>

<script>
   import firebase from '../firebase-config';
   import {  db } from '../firebase-config';

export default {
  name: 'cancel',

  data() {
      return {
        busy: false,
        ticket: '',
        tickets: ''
        
      }
    },

      props: {
       ticketid: {
        type: String,
        required: true
      },
      pricebreakid: {
        type: String,
        required: true
      }
  },


firebase () {
       
   let  ticketid = String(this.$props.ticketdata) ;
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
         let key = ticket['.key'];
          let pricebreak =  db.ref('pricebreaks').orderByChild("eventid").equalTo(this.ticket.eventid) ;
       this.$firebaseRefs.users.child(key).remove();
       let reserved = pricebreak.reserved - this.ticket.tickets;
       this.$firebaseRefs.pricebreaks.child(pricebreak['.key']).child('reserved').set(reserved);
      }
  },
  
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/styles.scss";
  </style>
