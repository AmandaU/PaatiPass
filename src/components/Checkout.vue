<template>
  <div class="hello">
    
     <div>{{ip}}</div>
     <!-- <div v-html="results"/> -->
    <div  v-for="user in users" :key="user['.key']">
      <p>{{setBuyer(user)}}</p>
    </div>
     <cube-spin v-if="busy"></cube-spin>
    <h1>Check out:</h1>
    <h2>{{ ticketdata.eventname }}</h2>
    <h2>R {{ ticketdata.total }}</h2>
    <!-- <creditcard  @eventname="updateparent"></creditcard> -->
     <!-- <button @click="BuyTickets()" >Buy</button> -->
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
        required: true // User can accept a userData object on params, or not. It's totally optional.
      },
       pricebreakdata: {
        type: Object,
        required: true // User can accept a userData object on params, or not. It's totally optional.
      }
  },

  data() {
      return {
        isready: false,
        results: [],
        buyer: '',
        timeStampParam: 'timestamp',
        versionParam: 'version',
        merchantID: '10011455',//'12581557',
        merchantKey: 'ztdbyg14s7nyd',//'49qsjtvgayqaw',//
        buyerEmail: 'sbtu01@payfast.co.za',
        buyerPassword: 'clientpass',
        busy: false,
        ip: "",
        response: ""
        
      }
    },

 firebase () {
        let  eventid = String(this.$props.ticketdata.eventid) ;
       let  userid = String(this.$props.ticketdata.userid) 
    return {
      tickets: db.ref('tickets'),
       events: myEventsRef,//myEventsRef, // loopable with v-for
       pricebreaks:  db.ref('pricebreaks').orderByChild("eventid").equalTo(eventid) ,
       users: db.ref('users').orderByChild("uid").equalTo(userid).limitToFirst(1) ,
       usersObj: { // can use keys, but v-for doesn't loop
            source: db.ref('users').orderByChild("uid").equalTo(userid).limitToFirst(1) ,
            asObject: true
          }
       }
      },

       mounted() {
        
            // axios({ method: "GET", "url": "https://httpbin.org/ip" }).then(result => {
            //     this.ip = result.data.origin;
            // }, error => {
            //     console.error(error);
            // });
        },

        computed: {
    // a computed getter
    payFastUrl: function () {
    
      let key = this.$props.pricebreakdata['.key'];
      var url =  'https://sandbox.payfast.co.za/eng/process?cmd=_paynow&receiver=10011455&item_name=' + this.$props.ticketdata.eventname + 
      '&item_description=tickets&amount=' + this.$props.ticketdata.total + '.00' + 
      '&return_url=http%3A%2F%2F192.168.8.107%3A8080%2F%23%2FSuccess%2F%3Fticketid%3D' + this.$props.ticketdata.reference + '%26pricebreakid%3D' + key;
      '&return_url=http%3A%2F%2F192.168.8.107%3A8080%2F%23%2FCancel%2F%3Fticketid%3D' + this.$props.ticketdata.reference + '%26pricebreakid%3D' + key;
        console.log(url);
      return url;
    }
  },

  methods: {

    saveTicket: function() {
       this.$firebaseRefs.tickets.push(this.$props.ticketdata);
    },

    setBuyer (buyer)
    {
      this.buyer = buyer;
      this.isready = true;
    },

    ProcessPayment()
    {
      debugger;
      this.isProcessingPayment = true;
      let pricebreak = this.$props.pricebreakdata;
      let ticket = this.$props.ticketdata;
      let key = pricebreak['.key'];
      let sold  = String(Number(pricebreak.sold) + Number(ticket.tickets));

      let returnUrl = encodeURIComponent("http://www.jadeayla.com"); 
      let cancelUrl = encodeURIComponent("http://www.jadeayla.com"); 
      let notifyUrl = encodeURIComponent("http://www.jadeayla.com"); 

      // let returnUrl = encodeURIComponent("http://192.168.8.107:8080/#/Success"); 
      // let cancelUrl = encodeURIComponent("http://192.168.8.107:8080/#/Cancel"); 
      // let notifyUrl = encodeURIComponent("http://192.168.8.107:8080/#/Notify");
     
      let buyerEmail = "sbtu01@payfast.co.za";
      let confirmationEmail = encodeURIComponent("admin@jadeayla.com");
 
       let nospaces = this.buyer.cellphone.split(' ').join('');
      let cell = '0' + nospaces.substring(3, nospaces - 3);

      let merchantData = 'merchant_id=' + this.merchantID + '&merchant_key=' + this.merchantKey ;
      let urls = '&return_url=' + returnUrl + '&cancel_url=' + cancelUrl + '&notify_url=' + notifyUrl;
      let buyerData = '&name_first=' + this.buyer.firstname + '&name_last=' + this.buyer.surname + '&email_address=' + buyerEmail  
      + '&cell_number=' + cell;
      let purchaseData = '&m_payment_id=' + ticket.reference + '&amount=' + ticket.total + '&item_name=' + ticket.eventname;
      let constantData =  '&item_description=tickets' //+ '&email_confirmation=1&confirmation_address=' + confirmationEmail;
      let data =  merchantData  + urls + buyerData + purchaseData + constantData;
      let hashsignature = md5(data);
      data = data + '&signature=' + hashsignature;
   
      let self = this;
      var params = {
            merchant_id: this.merchantID,
            merchant_key: this.merchantKey,
             return_url: returnUrl,
             cancel_url: cancelUrl,
             notify_url: notifyUrl,
            name_first: this.buyer.firstname,
            name_last: this.buyer.surname,
            email_address: buyerEmail,
            cell_number: cell,
            m_payment_id: ticket.reference,
            amount: ticket.total,
            item_name: ticket.eventname,
            item_description: "tickets",
            // email_confirmation: "1",
            // confirmation_address: confirmationEmail,
            signature: hashsignature
       };

     
    let paramstring = qs.stringify(params);
    hashsignature = md5(paramstring);
    paramstring = paramstring + '&signature=' + hashsignature;
           this.postData("https://cors-anywhere.herokuapp.com/https://sandbox.payfast.co.za/eng/process/", params)
       .then(data => 
        {
          console.log(JSON.stringify(data));
        self.results = data;
        }) // JSON-string from `response.json()` call
        .catch(error => console.error(error));
     
    //   axios.post("https://cors-anywhere.herokuapp.com/https://sandbox.payfast.co.za/eng/process/", params)
    //  // axios.post("https://cors-anywhere.herokuapp.com/https://payfast.co.za/eng/process/", qsstring)
    //   .then(result => {
    //      self.results = result.data;
    //       self.busy = false;
    //     }, error => {
    //       //self.$firebaseRefs.pricebreaks.child(key).child('reserved').set(pricebreak.reserved);
    //       var st = error.status;
    //     });
    },

       postData: function(url = '', data = {}) {
  // Default options are marked with *
    return fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            //"Content-Type": "application/json",
             "Content-Type": "application/x-www-form-urlencoded",
             "Content-Length": qs.stringify(data).length,
              "x-requested-with": "origin"
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        body: qs.stringify(data)
    })
    .then(function(response) {
  return response.text();});
},

    updateparent(variable) {
    
       this.card = variable
       this.BuyTickets();
    },
    
      BuyTickets() {

       this.busy = true;
       
        let pricebreak = this.$props.pricebreakdata;
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