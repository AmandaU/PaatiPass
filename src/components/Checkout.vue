<template>
  <div class="hello">
    
     <div>{{ip}}</div>
     <div  v-for="promotion in promotions" :key="promotion['.key'] ">
     </div>
    <cube-spin v-if="busy"></cube-spin>
    <h1>Check out:</h1>
    <h2>{{ shoppingcart.eventname }}</h2>
    <h2>R {{ purchasevalue }}</h2>
    <h2 v-show="!haspromo">If you have a promo code, please enter it here:</h2>
     <h2 v-show="haspromo">Your promotion value is: R {{ shoppingcart.promotionvalue }}</h2>
    <input  type="text" v-model="promocode" placeholder="Promo code"><br>
    <!-- <creditcard  @eventname="updateparent"></creditcard> -->
     <button v-show="isready" @click="saveTicketLocal()" >Buy</button>
     <br>
        <!-- <a href="https://sandbox.payfast.co.za/eng/process?cmd=_paynow&amp;receiver=10011455&amp;item_name=Event&amp;item_description=tickets&amp;amount=100.00&amp;return_url=http%3A%2F%2F192.168.8.107%3A8080%2F%23%2FSuccess%2Fid%3D12345&amp;cancel_url=http%3A%2F%2F192.168.8.107%3A8080%2F%23%2FCancel%2Fid%3D12345"><img src="https://www.payfast.co.za/images/buttons/dark-large-paynow.png" width="174" height="59" alt="Pay" title="Pay Now with PayFast" /></a> -->
      <!-- <a v-show="isready" href="https://sandbox.payfast.co.za/eng/process?cmd=_paynow&amp;receiver=10011455&amp;item_name=Event&amp;item_description=tickets&amp;amount=100.00&amp;return_url=http%3A%2F%2F192.168.8.107%3A8080%2F%23%2FSuccess%2F%3Fid%3D12345&amp;cancel_url=http%3A%2F%2F192.168.8.107%3A8080%2F%23%2FCancel%2F%3Fid%3D12345"><img src="https://www.payfast.co.za/images/buttons/dark-large-paynow.png" width="174" height="59" alt="Pay" title="Pay Now with PayFast" /></a> -->
      <!-- <a href="https://sandbox.payfast.co.za/eng/process?cmd=_paynow&amp;receiver=12581557&amp;item_name=Event&amp;item_description=tickets&amp;amount=100.00&amp;return_url=http%3A%2F%2F192.168.8.107%3A8080%2F%23%2FSuccess%2F%3Fticketid%3D12345%26pricebreakid%3D6789&amp;cancel_url=http%3A%2F%2F192.168.8.107%3A8080%2F%23%2FCancel%2F%3Fticketid%3D12345%26pricebreakid%3D6789"><img src="https://www.payfast.co.za/images/buttons/dark-large-paynow.png" width="174" height="59" alt="Pay" title="Pay Now with PayFast" /></a> -->
 
 <a v-show="isready" @click="saveTicket"  v-bind:href="payFastUrl"><img src="https://www.payfast.co.za/images/buttons/dark-large-paynow.png" width="174" height="59" alt="Pay" title="Pay Now with PayFast" /></a>
   <br>
    <div id="Zapper"></div>
   <!-- <script type="application/javascript" src="https://code.zapper.com/zapper.js"></script> -->
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

  
export default {
  name: 'checkout',
  components: {
      CubeSpin,
      //Creditcard
    },
   props: {
       shoppingcart: {
        type: Object,
        required: true,// User can accept a userData object on params, or not. It's totally optional.
      }
  },

  data() {
      return {
        ticket: {},
        promotions: [],
        promocode: "",
        purchasevalue: "",
        haspromo: false,
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
      let  userid = String(this.$props.shoppingcart.userid) 
      let eventid = this.$props.shoppingcart.eventid; 
    return {
       pricebreaks: db.ref('pricebreaks'),
       promotions: db.ref('promotions').orderByChild("eventid").equalTo(eventid),
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

 mounted() {
   let self = this;
  this.$loadScript("https://code.zapper.com/zapper.js")
    .then(() => {
       zapper("#Zapper", 1, 1, self.$props.shoppingcart.total,self.$props.shoppingcart.reference, function (paymentResult) {
          debugger;
    // Do something with the payment result.
        });
    })
    .catch(() => {
      // Failed to fetch script
    });
    console.log('App mounted!');
   
},
watch: {
    promocode: function (val) {
       var foundpromo = false;
       
       this.promotions.forEach(p => {
        if(foundpromo) return;
          if(p.code.toLowerCase() == val.toLowerCase())
          {
            foundpromo = true;
            if(p.redeemed >= p.number)
            {
              this.promocode = "Promotion closed"
            }
            else
            {
              this.promocode = p.code;
              this.shoppingcart.promocode = p.code;
              this.purchasevalue =  String(this.$props.shoppingcart.total - p.value);
              this.shoppingcart.promotionvalue = p.value;
              this.haspromo = true;
            }
          }
        });
        if(!foundpromo) 
          {
            this.haspromo = false;
            this.shoppingcart.promocode = "";
            this.shoppingcart.promotionvalue = '';
            this.purchasevalue = String(this.$props.shoppingcart.total);
          }
      },
   },

  computed: {

    // a computed getter
    payFastUrl: function () {
     
         let key = this.shoppingcart.pricebreak['.key'];
        const url =  'https://sandbox.payfast.co.za/eng/process?cmd=_paynow&receiver=10011455&item_name=' + this.shoppingcart.eventname 
        + '&item_description=tickets&amount=' + this.purchasevalue + '.00' 
        + '&return_url=http%3A%2F%2F192.168.8.104%3A8080%2F%23%2FSuccess%2F%3Fticketid%3D' + this.shoppingcart.reference + '%26pricebreakid%3D' + key
        + '&cancel_url=http%3A%2F%2F192.168.8.104%3A8080%2F%23%2FCancel%2F%3Fticketid%3D' + this.shoppingcart.reference + '%26pricebreakid%3D' + key;
        //console.log(url);
        return url;
    },
  },

  created() {
    this.shoppingcart = this.$props.shoppingcart;
    this.purchasevalue = this.shoppingcart.total;  
  },

  methods: {

    saveTicket() {
     debugger;
     this.shoppingcart.total = this.purchasevalue;
      let key = this.shoppingcart.pricebreak['.key'];
      let totalreserved  = Number(this.shoppingcart.pricebreak.reserved) + Number(this.shoppingcart.tickets);
      this.$firebaseRefs.pricebreaks.child(key).child('reserved').set(totalreserved);
      //this.$firebaseRefs.promotions.child(this.promocode['.key']).child('isUsed').set(true);
      localStorage.setItem(this.shoppingcart.reference, JSON.stringify(this.shoppingcart));
      //test
      //this.$router.replace({ name: 'Success', params: {ticketid: String(this.$props.shoppingcart.reference)}});
    },

    saveTicketLocal() {
     
      let key = this.shoppingcart.pricebreak['.key'];
      let totalreserved  = Number(this.shoppingcart.pricebreak.reserved) + Number(this.shoppingcart.tickets);
      this.$firebaseRefs.pricebreaks.child(key).child('reserved').set(totalreserved);
      //this.$firebaseRefs.promotions.child(this.promocode['.key']).child('isUsed').set(true);
      localStorage.setItem(this.shoppingcart.reference, JSON.stringify(this.shoppingcart));
      //test
      this.$router.replace({ name: 'Success', params: {ticketid: String(this.$props.shoppingcart.reference)}});
    },

    buyTicket() {
       
       this.busy = true;
       var key = this.shoppingcart.pricebreak['.key'];
       let totalreserved  = this.shoppingcart.pricebreak.reserved + this.shoppingcart.tickets;
       this.$firebaseRefs.pricebreaks.child(key).child('reserved').set(totalreserved);
       this.ProcessPayment();
     },
  }
}

</script>

<style lang="scss" scoped>
  @import "~@/styles/styles.scss";
  </style>