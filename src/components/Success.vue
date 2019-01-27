<template>
  <div class="success">
    <h1>Your payment was successful</h1>
     <button v-show="isReady" @click="BuyTickets()" >Buy more tickets</button>
     <div  v-for="ticket in tickets" :key="ticket['.key']">
       <p>{{setTicket(ticket)}}</p>
      </div>
    
  </div>
</template>

<script>
  
import {  db } from '../firebase-config';

export default {
  name: 'success',

  data() {
      return {
        ticket: '',
         tickets: [],
        pricebreak:'',
        pricebreaks: [],
        pricebreaksObj: {},
        isReady: false,
       
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
      },
  },

firebase () {
 
   let  ticketid = String(this.$props.ticketid) ;
   
        return {
           tickets: db.ref('tickets').orderByChild("reference").equalTo(ticketid).limitToFirst(1) ,
            pricebreaks: db.ref('pricebreaks'),
             pricebreaksObj: { // can use keys, but v-for doesn't loop
            source: db.ref('pricebreaks'),
            asObject: true
            },
        }
      },
  mounted() {
 
},

 computed: {
   
  },

methods: {

    BuyTickets() {
       this.$router.replace({ name: 'Home'});
    },

    setTicket (ticket)
    {
    debugger;
      this.ticket = ticket;
      let pricebreak =  this.$firebaseRefs.pricebreaksObj[this.$props.pricebreakid];
      let sold  = String(Number(pricebreak.sold) + Number(this.ticket.tickets));

      this.$firebaseRefs.pricebreaks.child(this.$props.pricebreakid).child('sold').set(sold);
      this.isReady = true;
     
    },

  },
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/styles.scss";
  </style>
