<template>
  <div class="centralcontainer">
      <div class="centreblock">
    <br> <br>
        <cube-spin v-if="busy"></cube-spin>
       <h1 >Scan the QR Code</h1>
       <div class="hoveritem"  v-on:click="reset()" >Reset</div>
    </div>
    
    <div class="qrblock">
       
      <vue-qr-reader 
      :key="qrScannerKey"
      v-on:code-scanned="codeArrived" 
       stop-on-scanned=false
      responsive=true />
     </div> 

    <div class="qrinfo">
      <h3 padding-left="20px">Ticket Purchaser: {{purchaser}}</h3>
      <h3 padding-left="20px">Email address: {{email}}</h3>
      <h3 padding-left="20px">Ticket for: {{holder}}</h3>
      <h3 padding-left="20px">Email address: {{holderemail}}</h3>
   </div>
   </div>
    
</template>

<script>
   import firebase from '../firebase-config';
   import { db } from '../firebase-config';
   import VueQrReader from 'vue-qr-reader/dist/lib/vue-qr-reader.umd.js';
  
export default {
  name: 'scanqr',

 components: {
      VueQrReader,
  },

  mounted() {
    window.addEventListener('resize', this.handleWindowResize);
    console.log('App mounted!');
},

 beforeDestroy: function () {
  window.removeEventListener('resize', this.handleWindowResize)
},

  data() {
      return {
        busy: false,
        ticketReference: "",
        tickets: [],
        purchaser: "",
        email: "",
        holder: "",
        holderemail: "",
        qrScannerKey: 0,
       }
    },

firebase() {
    return {
          tickets: db.ref('pricebreaks')
         }
      },

methods: {

   handleWindowResize(event) { 
       this.reset();
   },

    reset(){
        this.ticketReference = "";
        this.purchaser = "";
        this.email = "";
        this.holder = "";
        this.holderemail = "";
         this.qrScannerKey += 1;  
    },

    codeArrived (code) {
       if(code == "")return;
        console.log(code);
        var splits = code.split('|');
        this.ticketReference = splits[0];
        this.purchaser = splits[1];
        this.email = splits[2];
        this.holder = splits[3];
        this.holderemail = splits[4];
        this.UpdateData();
    },

    UpdateData()
    {
      this.busy = true;
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
               this.busy = false;
            }
        );
    },

  }
  
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/styles.scss";
  </style>