<template>
    <div class="centralcontainer" >
      <div class="centreblock">
    <h1>Scan the QR Code</h1>
      </div>
    </div>
</template>

<script>
   import firebase from '../firebase-config';
   import {  db } from '../firebase-config';

export default {
  name: 'scanqr',

   mounted() {
   
    if(localStorage.getItem(this.$props.ticketid))
      {
         this.shoppingcart = JSON.parse(localStorage.getItem(this.$props.ticketid));
       }
   },

  data() {
      return {
        busy: false,
        ticketReference: "",
        ticket:{}
      }
    },

      props: {
       ticketid: {
        type: String,
        required: true,
      }
  },

firebase() {
    return {
          tickets: db.ref('pricebreaks')
         }
      },

  methods: {
     UpdateData()
      {
        this.$bindAsArray(
            "tickets",
            db.ref('tickets').orderByChild("reference").equalTo(this.ticketReference).limitToFirst(1),
            null,
            () => {
                 this.ticket = this.tickets[0];
                 if(this.ticket.used)
                 {
                     alert("This ticket has already been used!!!!!");
                 }
                 else
                 {
                     this.$firebaseRefs.tickets.child(this.ticket['.key']).child('used').set(true);
                     alert("Ticket successfully scanned");
                 }
                 
              }
          );
      }
  }
  
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/styles.scss";
  </style>