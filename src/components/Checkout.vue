<template>
  <div class="hello">
    <div  v-for="user in users" :key="user['.key']">
      <p>{{setBuyer(user)}}</p>
    </div>
     <cube-spin v-if="busy"></cube-spin>
    <h1>Check out:</h1>
    <h2>{{ ticketdata.eventname }}</h2>
    <h2>R {{ ticketdata.total }}</h2>
    <!-- <creditcard  @eventname="updateparent"></creditcard> -->
     <button @click="BuyTickets()" >Buy</button>
  </div>
</template>

<script>

//Vue.prototype.$http = axios.
  import Creditcard from './Creditcard'
  import CubeSpin from 'vue-loading-spinner/src/components/ScaleOut'
  import firebase from '../firebase-config';
  import {  db } from '../firebase-config';
  import axios from "axios";
  import md5 from "js-md5";

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
        buyer: '',
        merchantIDParam: 'merchant-id',
        passphraseParam: 'passphrase',
        timeStampParam: 'timestamp',
        versionParam: 'version',
        merchantID: '10011455',
        merchantKey: 'ztdbyg14s7nyd',
        buyerEmail: 'sbtu01@payfast.co.za',
        buyerPassword: 'clientpass',
        sandBoxUrl: 'https://sandbox.payfast.co.za/eng/process',
        sandBoxAmount: '150',
        timeStamp: '2018-04-01T12:00:01+02:00',
        busy: false,
        ip: "",
        response: ""
        //  card: {
        //   number: '',
        //   owner: '',
        //   expiration: {
        //   month: '',
        //   year: ''
        //   },
        //   cvc: ''
        //  }
            
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

            axios({ method: "GET", "url": "https://httpbin.org/ip" }).then(result => {
                this.ip = result.data.origin;
            }, error => {
                console.error(error);
            });
        },

  methods: {

    setBuyer (buyer)
    {
      this.buyer = buyer;
    },
 
    ProcessPayment: function()
      {
    debugger;

       let ticket = this.$props.ticketdata;
       let cell = this.buyer.cellphone.split(' ').join('');
       let merchantData = 'merchant_id=' + this.merchantID + '&merchant_key=' + this.merchantKey + '&return_url=http://169.202.224.2:8080/Home';
       let buyerData = '&name_first=' + this.buyer.firstname + '&name_last=' + this.buyer.surname + '&email_address=' + this.buyer.email + '&cell_number=' + cell;
       let purchaseData = '&m_payment_id=' + ticket.reference + '&amount=' + ticket.total + '&item_name=' + ticket.eventname;
       let constantData =  '&item_description=tickets' + '&email_confirmation=1&confirmation_address=admin@jadeayla.com&payment_method=cc,dc&subscription_type=2&signature=';
       let data =  merchantData + buyerData + purchaseData + constantData;
       let hashsignature = md5(data);
       data = data + hashsignature;
       debugger;
       axios({ method: "POST", "url": "https://sandbox.payfast.co.za/eng/process", "data": data, "headers": { "content-type": "application/json" } }).then(result => {
            this.response = result.data;
                 return true;
                }, error => {
                    console.error(error);
                  return false;
                });
      },

    updateparent(variable) {
    
       this.card = variable
       this.BuyTickets();
    },
    
      BuyTickets() {

       this.busy = true;
       debugger;
 
        let pricebreak = this.$props.pricebreakdata;
        let ticket = this.$props.ticketdata;
        var key = pricebreak['.key'];
      
        let totalreserved  = String(Number(pricebreak.reserved) + Number(ticket.tickets));
        let sold  = String(Number(pricebreak.sold) + Number(ticket.tickets));
        this.$firebaseRefs.pricebreaks.child(key).child('reserved').set(totalreserved);

      if(this.ProcessPayment())
      {
        this.$firebaseRefs.pricebreaks.child(key).child('sold').set(sold);
        ticket.price = pricebreak.price;
        this.$firebaseRefs.tickets.push(ticket)
      }
      else
      {
         this.$firebaseRefs.pricebreaks.child(key).child('reserved').set(pricebreak.reserved);
      }
         this.busy = false;
      },

  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/styles.scss";
  </style>