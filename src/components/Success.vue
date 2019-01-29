<template>
  <div class="success">
    <h1>Your payment was successful</h1>
    <p>{{message1}}</p>
    <p>{{message2}}</p>
    <p>{{message3}}</p>
    <br>
    <qrcode-vue v-show="isReady" :value="ticket.reference"></qrcode-vue>'
    <br> <br> <br>
     <button v-show="isReady" @click="BuyTickets()" >Buy more tickets</button>
   </div>
</template>

<script>
  
import {  db } from '../firebase-config';
import QrcodeVue from 'qrcode.vue';

export default {
  name: 'success',

  components: {
    QrcodeVue
  },

  data() {
      return {
        ticket: {},
        pricebreak:{},
        isReady: false,
        message1:"",
        message2:"",
        message3:"",
      }
    },

 props: {
      ticketid: {
        type: String,
        required: true,
      },
      pricebreakid: {
        type: String,
        required: true,
      }
  },

  watch: {
    isReady: function (val) {
      debugger;
      if(val)
      {
        this.setTicket();
      }
    },
    
  },

firebase() {
  
       return {
           tickets: db.ref('tickets'),
            pricebreaks: {
            source: db.ref('pricebreaks'),//.orderByChild("id").equalTo(this.$props.pricebreakid).limitToFirst(1),
           asObject: true,
              readyCallback: () =>   
              {
                this.pricebreak = this.pricebreaks[this.$props.pricebreakid];
                this.setTicket();
              }
            },
         }
      },

  mounted() {
  
    console.log('App mounted!');
    if (localStorage.getItem(this.$props.ticketid) )
    {
      this.ticket = JSON.parse(localStorage.getItem(this.$props.ticketid));
    }
},
 
methods: {

    BuyTickets() {
       this.$router.replace({ name: 'Home'});
    },

    setConfirmationInfo(){
      debugger;
       const reference = 'Reference number: ' + this.ticket.reference;
        const total = String(Number(this.ticket.tickets) * Number(this.ticket.total));
        const numberOfTickets = Number(this.ticket.tickets) > 1? ' tickets at R': ' ticket for R';
        const each = Number(this.ticket.tickets) > 1? ' each': '';
        this.message1 = 'You have successfully purchased ' + this.ticket.tickets + numberOfTickets + this.ticket.total + each + ' for ' + this.ticket.eventname;
        this.message2 = 'The total deducted from your account is R' + total;
        this.message3 = 'You have been emailed this QRCode which you must present at the venue door';
        this.isReady = true;
    },

    setTicket ()
    {
      debugger;
      const sold = String(Number(this.pricebreak.sold) + Number(this.ticket.tickets));
      this.$firebaseRefs.pricebreaks.child(this.$props.pricebreakid).child('sold').set(sold);
      this.$firebaseRefs.tickets.push(this.ticket);
      this.setConfirmationInfo();
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "~@/styles/styles.scss";
  </style>
