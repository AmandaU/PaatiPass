<template>
    <div class="centralcontainer">
        <h1 padding-left="20px">Scan the QR Code</h1>
        <vue-qr-reader 
        :key="qrScannerKey"
         v-on:code-scanned="codeArrived" 
         stop-on-scanned="false"
         responsive="true"/>
    </div>
</template>

<script>
   import firebase from '../firebase-config';
   import {  db } from '../firebase-config';
   import VueQrReader from 'vue-qr-reader/dist/lib/vue-qr-reader.umd.js';

export default {
  name: 'scanqr',

 components: {
      VueQrReader
  },

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
        ticket:{},
        qrScannerKey: 0,
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

    codeArrived (code) {
        console.log(code);
        this.ticketReference = code;
        this.UpdateData();
    },

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
                this.qrScannerKey += 1;  
               // this.$router.go(0);
            }
        );
    }
  }
  
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/styles.scss";
  </style>