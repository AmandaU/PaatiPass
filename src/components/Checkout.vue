<template>
  <div class="hello">
    
     <div>{{ip}}</div>
    <cube-spin v-if="busy"></cube-spin>
    <h1>Check out:</h1>
    <h2>{{ ticketdata.eventname }}</h2>
    <h2>R {{ ticketdata.total }}</h2>
    <!-- <creditcard  @eventname="updateparent"></creditcard> -->
     <button @click="saveTicket()" >Buy</button>
     <br>
        <!-- <a href="https://sandbox.payfast.co.za/eng/process?cmd=_paynow&amp;receiver=10011455&amp;item_name=Event&amp;item_description=tickets&amp;amount=100.00&amp;return_url=http%3A%2F%2F192.168.8.107%3A8080%2F%23%2FSuccess%2Fid%3D12345&amp;cancel_url=http%3A%2F%2F192.168.8.107%3A8080%2F%23%2FCancel%2Fid%3D12345"><img src="https://www.payfast.co.za/images/buttons/dark-large-paynow.png" width="174" height="59" alt="Pay" title="Pay Now with PayFast" /></a> -->
      <!-- <a v-show="isready" href="https://sandbox.payfast.co.za/eng/process?cmd=_paynow&amp;receiver=10011455&amp;item_name=Event&amp;item_description=tickets&amp;amount=100.00&amp;return_url=http%3A%2F%2F192.168.8.107%3A8080%2F%23%2FSuccess%2F%3Fid%3D12345&amp;cancel_url=http%3A%2F%2F192.168.8.107%3A8080%2F%23%2FCancel%2F%3Fid%3D12345"><img src="https://www.payfast.co.za/images/buttons/dark-large-paynow.png" width="174" height="59" alt="Pay" title="Pay Now with PayFast" /></a> -->
 <!-- <a href="https://sandbox.payfast.co.za/eng/process?cmd=_paynow&amp;receiver=12581557&amp;item_name=Event&amp;item_description=tickets&amp;amount=100.00&amp;return_url=http%3A%2F%2F192.168.8.107%3A8080%2F%23%2FSuccess%2F%3Fticketid%3D12345%26pricebreakid%3D6789&amp;cancel_url=http%3A%2F%2F192.168.8.107%3A8080%2F%23%2FCancel%2F%3Fticketid%3D12345%26pricebreakid%3D6789"><img src="https://www.payfast.co.za/images/buttons/dark-large-paynow.png" width="174" height="59" alt="Pay" title="Pay Now with PayFast" /></a> -->
 
 <a v-show="isready" @click="saveTicket"  v-bind:href="payFastUrl"><img src="https://www.payfast.co.za/images/buttons/dark-large-paynow.png" width="174" height="59" alt="Pay" title="Pay Now with PayFast" /></a>
     
  </div>
</template>

<script>

  import Creditcard from './Creditcard'
  import CubeSpin from 'vue-loading-spinner/src/components/ScaleOut'
  import firebase from '../firebase-config';
  import {  db } from '../firebase-config';
  import axios from "axios";
  import md5 from "js-md5";
  import qs from "qs";

  let myEventsRef = db.ref('events')
  

export default {
  name: 'checkout',
  components: {
      CubeSpin,
      Creditcard
    },
   props: {
       ticketdata: {
        type: Object,
        required: true,// User can accept a userData object on params, or not. It's totally optional.
      },
       pricebreakdata: {
        type: Object,
        required: true, // User can accept a userData object on params, or not. It's totally optional.
      }
  },

  data() {
      return {
        isready: false,
        results: [],
        buyer: {},
        timeStampParam: 'timestamp',
        versionParam: 'version',
        merchantID: '10011455',//'12581557',
        merchantKey: 'ztdbyg14s7nyd',//'49qsjtvgayqaw',//
        buyerEmail: 'sbtu01@payfast.co.za',
        buyerPassword: 'clientpass',
        busy: false,
        ip: "",
      }
    },

 firebase () {
       let  userid = String(this.$props.ticketdata.userid) 
    return {
       pricebreaks: db.ref('users'),
       users: {
        source: db.ref('users').orderByChild("uid").equalTo(userid).limitToFirst(1),
        // asObject: true,
          readyCallback: () =>   
          {
            this.buyer = this.users[0];
            this.isready = true;
        },
       }
      }
     },

  computed: {
    // a computed getter
    payFastUrl: function () {
        const key = this.$props.pricebreakdata['.key'];
        const url =  'https://sandbox.payfast.co.za/eng/process?cmd=_paynow&receiver=10011455&item_name=' + this.$props.ticketdata.eventname 
        + '&item_description=tickets&amount=' + this.$props.ticketdata.total + '.00' 
        + '&return_url=http%3A%2F%2F192.168.8.107%3A8080%2F%23%2FSuccess%2F%3Fticketid%3D' + this.$props.ticketdata.reference + '%26pricebreakid%3D' + key
        + '&cancel_url=http%3A%2F%2F192.168.8.107%3A8080%2F%23%2FCancel%2F%3Fticketid%3D' + this.$props.ticketdata.reference + '%26pricebreakid%3D' + key;
        //console.log(url);
        return url;
    },
  },

  methods: {

    saveTicket() {
     
      const ticket = this.$props.ticketdata;
      const pricebreak = this.$props.pricebreakdata;
      const key = pricebreak['.key'];
      let totalreserved  = String(Number(pricebreak.reserved) + Number(ticket.tickets));
      this.$firebaseRefs.pricebreaks.child(key).child('reserved').set(totalreserved);
      localStorage.setItem(this.$props.ticketdata.reference, JSON.stringify(this.$props.ticketdata));
      //test
     //this.$router.replace({ name: 'Success', params: {ticketid: String(this.$props.ticketdata.reference), pricebreakid: String(key)}});
    },

    buyTicket() {
       
       this.busy = true;
        let ticket = this.$props.ticketdata;
        var key = pricebreak['.key'];
       let totalreserved  = String(Number(pricebreak.reserved) + Number(ticket.tickets));
        this.$firebaseRefs.pricebreaks.child(key).child('reserved').set(totalreserved);
       this.ProcessPayment();
     },
  }
}

</script>

<style lang="scss" scoped>
  @import "~@/styles/styles.scss";
  </style>