<template>
  <div class="hello">
    <media :query="{maxWidth: 800}" @media-enter="media800Enter" @media-leave="media800Leave"> </Media> 
     <div>{{ip}}</div>
    <cube-spin v-if="!isready"></cube-spin>
    <h1>Check out:</h1>
    <h2>{{ shoppingcart.eventname }}</h2>
    <h2>R {{ purchasevalue }}</h2>
    <h1 v-show="!haspromo">If you have a promo code, please enter it here:</h1>
     <h1 v-show="haspromo">Your promotion value is: R {{ shoppingcart.promotionvalue }}</h1><br>
     <small v-show="invalidpromo"><font color="red">Your promo code is not quite right yet...</font></small><br>
    <input  type="text" v-model="promocode" placeholder="Promo code"><br>
    <!-- <creditcard  @eventname="updateparent"></creditcard> -->
     <button v-show="isready" @click="saveTicketLocal()" >Buy</button><br>
     <br>
        <!-- <a href="https://sandbox.payfast.co.za/eng/process?cmd=_paynow&amp;receiver=10011455&amp;item_name=Event&amp;item_description=tickets&amp;amount=100.00&amp;return_url=http%3A%2F%2F192.168.8.107%3A8080%2F%23%2FSuccess%2Fid%3D12345&amp;cancel_url=http%3A%2F%2F192.168.8.107%3A8080%2F%23%2FCancel%2Fid%3D12345"><img src="https://www.payfast.co.za/images/buttons/dark-large-paynow.png" width="174" height="59" alt="Pay" title="Pay Now with PayFast" /></a> -->
      <!-- <a v-show="isready" href="https://sandbox.payfast.co.za/eng/process?cmd=_paynow&amp;receiver=10011455&amp;item_name=Event&amp;item_description=tickets&amp;amount=100.00&amp;return_url=http%3A%2F%2F192.168.8.107%3A8080%2F%23%2FSuccess%2F%3Fid%3D12345&amp;cancel_url=http%3A%2F%2F192.168.8.107%3A8080%2F%23%2FCancel%2F%3Fid%3D12345"><img src="https://www.payfast.co.za/images/buttons/dark-large-paynow.png" width="174" height="59" alt="Pay" title="Pay Now with PayFast" /></a> -->
      <!-- <a href="https://sandbox.payfast.co.za/eng/process?cmd=_paynow&amp;receiver=12581557&amp;item_name=Event&amp;item_description=tickets&amp;amount=100.00&amp;return_url=http%3A%2F%2F192.168.8.107%3A8080%2F%23%2FSuccess%2F%3Fticketid%3D12345%26pricebreakid%3D6789&amp;cancel_url=http%3A%2F%2F192.168.8.107%3A8080%2F%23%2FCancel%2F%3Fticketid%3D12345%26pricebreakid%3D6789"><img src="https://www.payfast.co.za/images/buttons/dark-large-paynow.png" width="174" height="59" alt="Pay" title="Pay Now with PayFast" /></a> -->
 
    <a v-show="isready" @click="saveTicket(false, shoppingcart)"  v-bind:href="payFastUrl"><img src="https://www.payfast.co.za/images/buttons/dark-large-paynow.png" width="174" height="59" alt="Pay" title="Pay Now with PayFast" /></a>
      <br>
    <a v-show="showZapperAppIcon" @click="saveTicket(true, shoppingcart)"  v-bind:href="zapperUrl"><img src="https://www.payfast.co.za/images/buttons/light-large-paynow.png" width="174" height="59" alt="Pay" title="Zapper" /></a>
   
   <br>
    <div id="Zapper" v-show="showZapperQRCode"></div>
   <!-- <script type="application/javascript" src="https://code.zapper.com/zapper.js"></script> -->
  </div>
</template>

<script>

 //import Creditcard from './Creditcard'
  import Media from 'vue-media'
  import CubeSpin from 'vue-loading-spinner/src/components/ScaleOut'
  import firebase from '../firebase-config';
  import config from './config';
  import {  db } from '../firebase-config';
  import axios from "axios";
  import md5 from "js-md5";
  import qs from "qs";

  
export default {
  name: 'checkout',
  components: {
      CubeSpin,
      Media
    },
   props: {
       shoppingcart: {
        type: Object,
        required: true,// User can accept a userData object on params, or not. It's totally optional.
      }
  },

  data() {
      return {
        invalidpromo: false,
        ticket: {},
        promotions: [],
        promocode: "",
        purchasevalue: "",
        haspromo: false,
        isready: false,
        buyer: {},
         merchantID: '10011455',//'12581557',
        merchantKey: 'ztdbyg14s7nyd',//'49qsjtvgayqaw',//
        greaterThan800: window.innerWidth > 800
      }
    },

 firebase () {
      let userid = this.$props.shoppingcart.userid;
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
     window.addEventListener('resize', this.handleWindowResize);
    let self = this;
    
      this.$loadScript("https://code.zapper.com/zapper.js")
      .then(() => {
        zapper("#Zapper", config.zapperConfig.merchantId, config.zapperConfig.siteId, self.purchasevalue,self.$props.shoppingcart.reference, function (paymentResult) {
           self.shoppingcart.paymentMethod = isZapper? 1: 0;
          if(payment.status == 1)
          {
            self.shoppingcart.zapperPaymentId = paymentResult.payment.paymentId;
            self.saveTicket(true,self.shoppingcart);
          }
          else
          {

            this.shoppingcart.zapperPaymentId = paymentResult.paymentId;
            localStorage.setItem(this.shoppingcart.reference, JSON.stringify(this.shoppingcart));
            this.$router.replace({ name: 'Cancel', params: {ticketid: self.shoppingcart.reference}});
          }
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
      if(val == "")
      {
        this.invalidpromo = false;
        return;
      }
      
       this.promotions.forEach(p => {
        if(foundpromo) return;
          if(p.code.toLowerCase() == val.toLowerCase())
          {
            foundpromo = true;
           this.invalidpromo = false;
            if(p.redeemed >= p.number)
            {
              this.promocode = "Promotion closed"
            }
            else
            {
              this.promocode = p.code;
              this.shoppingcart.promocode = p.code;
              this.shoppingcart.promotionvalue = p.value;
              this.purchasevalue =  String(this.total - p.value);
              this.haspromo = true;
            }
          }
          
        });
        if(!foundpromo) 
          {
            this.invalidpromo = true;
            this.haspromo = false;
            this.shoppingcart.promocode = "";
            this.shoppingcart.promotionvalue = '';
            this.purchasevalue = String(this.total);
          }

      },
   },

  beforeDestroy: function () {
  window.removeEventListener('resize', this.handleWindowResize)
},

  computed: {

    isMobile: function()
    {
        return navigator.userAgent.match(/Android/i) ||
          navigator.userAgent.match(/webOS/i) ||
          navigator.userAgent.match(/iPhone/i) ||
          navigator.userAgent.match(/iPad/i) ||
          navigator.userAgent.match(/iPod/i) ||
          navigator.userAgent.match(/BlackBerry/i) ||
          navigator.userAgent.match(/Windows Phone/i) ;
    },
     
    showZapperQRCode: function ()
    {
      return this.isready && !this.isMobile;
    },

    showZapperAppIcon: function ()
    {
      return this.isready && this.isMobile;
    },

    total: function()
    {
        return this.shoppingcart.tickets * Number(this.shoppingcart.pricebreak.price);
    },
    // a computed getter
    payFastUrl: function () {
     
         let key = this.shoppingcart.pricebreak['.key'];
        const url =  'https://sandbox.payfast.co.za/eng/process?cmd=_paynow&receiver=10011455&item_name=' + this.shoppingcart.eventname 
        + '&item_description=tickets&amount=' + this.purchasevalue + '.00' 
        + '&return_url=http%3A%2F%2F192.168.8.104%3A8080%2F%23%2FSuccess%2F%3Fticketid%3D' + this.shoppingcart.reference ;//+ '%26pricebreakid%3D' + key;
        + '&cancel_url=http%3A%2F%2F192.168.8.104%3A8080%2F%23%2FCancel%2F%3Fticketid%3D' + this.shoppingcart.reference ;//+ '%26pricebreakid%3D' + key ;
        //console.log(url);
        return url;
    },

     zapperUrl: function () {
     
         let key = this.shoppingcart.pricebreak['.key'];
       
        const qrcode = 'http://2.zap.pe?t=6&i=' + config.zapperConfig.merchantId + ':' + config.zapperConfig.siteId +':7[34|' + this.purchasevalue + '|11,66|' + this.shoppingcart.reference +
        '|10,60|1:10[38|Paati+Passports,39|ZAR';
        const url = 'https://www.zapper.com/payWithZapper?qr=' + qrcode + 
        '&appName=Paati+Passports' +
        '&successCallbackURL=http%3A%2F%2F192.168.8.104%3A8080%2F%23%2FSuccess%2F%3Fticketid%3D' + this.shoppingcart.reference ;//+ '%26pricebreakid%3D' + key ;
        '&failureCallbackURL=http%3A%2F%2F192.168.8.104%3A8080%2F%23%2FCancel%2F%3Fticketid%3D' + this.shoppingcart.reference ;//+ '%26pricebreakid%3D' + key ;
        return url;
    },
  },

  created() {
   
    this.shoppingcart = this.$props.shoppingcart;
    this.purchasevalue = this.total;  

  },

  methods: {

     media800Enter(mediaQueryString) {
      this.greaterThan800 = false
    },
    media800Leave(mediaQueryString) {
      
      this.greaterThan800 = true
    },

     handleWindowResize(event) { 
       
      if(window.innerWidth < 600)
      {
        this.containerWidth = event.currentTarget.innerWidth;
      }
      else
      if(window.innerWidth < 800)
      {
        this.containerWidth = event.currentTarget.innerWidth/2;
      }
      else
        this.containerWidth = event.currentTarget.innerWidth/3; 
    },
   
    saveTicket(isZapper, shoppingcart) {
      shoppingcart.zapperPaymentMethod = isZapper;
      let key = shoppingcart.pricebreak['.key'];
      let totalreserved  = Number(shoppingcart.pricebreak.reserved) + Number(shoppingcart.tickets);
      this.$firebaseRefs.pricebreaks.child(key).child('reserved').set(totalreserved);
      //this.$firebaseRefs.promotions.child(this.promocode['.key']).child('isUsed').set(true);
      localStorage.setItem(shoppingcart.reference, JSON.stringify(shoppingcart));
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