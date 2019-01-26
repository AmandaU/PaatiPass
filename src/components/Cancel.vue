<template>
  <div class="cancel">
    <h1>Your payment was been successfully cancelled</h1>
    <div  v-for="ticket in tickets" :key="ticket['.key']">
      <p>{{setBuyer(user)}}</p>
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
       ticketdata: {
        
        required: true // User can accept a userData object on params, or not. It's totally optional.
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
       this.$firebaseRefs.users.child(key).remove()
      }
  },
  
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/styles.scss";
  </style>
