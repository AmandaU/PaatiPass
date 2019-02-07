<template>
  <div class="success">
    <h1>Your payment was successful</h1>
      <cube-spin v-if="isReady"></cube-spin>
      <div width="75%">
        <p>{{message1}}</p>
        <p>{{message2}}</p>
        <p>{{message3}}</p>
      </div>
    <br>
      <div v-show="isReady" class="centreblock">
       <div  v-for="guest in guests" :key="guest.reference">
        <div  class="box">
          <h3>Ticket reference number: {{guest.reference}}</h3>
            <input  width="80%" type="text" v-model="guest.name" placeholder="Name"><br>
            <input width="80%" type="email" v-model="guest.email"  placeholder="Email"><br>
            <qrcode-vue  :value="guest.reference"></qrcode-vue>'
        </div>
      </div>
        <button v-show="isReady" @click="sendGuestTickets()" >Email your guest tickets</button>
   </div>
    
   </div>
</template>

<script>
import {zapperConfig} from '../config';
import firebase from '../firebase-config';
import {  db } from '../firebase-config';
import QrcodeVue from 'qrcode.vue';
import CubeSpin from 'vue-loading-spinner/src/components/ScaleOut'
import axios from "axios";
import { sha256, sha224 } from 'js-sha256';

export default {
  name: 'success',

  components: {
    QrcodeVue
  },

  data() {
      return {
       
        guests: [],
        users: [],
        user: {},
        pricebreaks:{},
        promotion: [],
        tickets: [],
        shoppingcart: {},
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
      }
  },

firebase() {
      return {
           guestsRef: db.ref('guests'),
           ticketsRef: db.ref('tickets'),
           pricebreaksRef: db.ref('pricebreaks'),
           promotionsRef: db.ref('promotions')
         }
      },

   computed: {

    userName: function () {
      return this.user.firstname + ' ' + this.user.surname;
    }
   },

  created(){

       let currentuser = firebase.auth().currentUser;
      if(localStorage.getItem(this.$props.ticketid))
      {
         this.shoppingcart = JSON.parse(localStorage.getItem(this.$props.ticketid));
        this.$bindAsArray(
            "users",
            db.ref('users').orderByChild("email").equalTo(currentuser.email).limitToFirst(1),
            null,
            () => {
                 this.user = this.users[0];
                 this.$bindAsObject(
                  "pricebreaks",
                  db.ref('pricebreaks'),
                  null,
                  () => {
                    // venues Ready Callback
                    // console.log(`all calls done`)
                    if(this.shoppingcart.zapperPaymentMethod)
                    {
                      this.getZapperPaymentDetails();
                    }
                    else
                    {
                     this.setTicket();
                    }
                  }
                );
              }
          );
         }
    },

methods: {

    processPromoCode(promocode)
    {
       this.$bindAsArray(
                  "promotion",
                  db.ref('promotions').orderByChild("code").equalTo(promocode).limitToFirst(1) ,
                  null,
                  () => {
                    let promo = this.promotion[0];
                    promo.redeemed += 1;
                    this.$firebaseRefs.promotionsRef.child(promo['.key']).child('redeemed').set(promo.redeemed);
                  }
                );
    },

    createGuestTickets()
    {
        for(var ticketkey in this.tickets)
        {
          let ticket = this.tickets[ticketkey];
          var guest = {
            email: "",
            name:  "",
            eventname: ticket.eventname,
            from: ticket.from,
            to: ticket.to,
            reference: ticket.reference,
            venuename: this.shoppingcart.venuename,
            venueaddress: this.shoppingcart.venueaddress,
            venuelatlong: this.shoppingcart.venuelatlong
          };
          this.guests.push(guest);
        }
    },

    sendGuestTickets()
    {
        for(var guestkey in this.guests)
        {
          let guest = this.guests[guestkey];
           if(guest.email && guest.email != this.user.email)
          {
             this.$firebaseRefs.guestsRef.push(guest);
          }
        }
         this.$router.replace({ name: 'Home'});
    },

    getZapperPaymentDetails()
    {
      const signature = this.createSecuritySignature(zapperConfig.posToken, zapperConfig.poskey);
      const url = 'https://zapapi.zapzap.mobi/ecommerce/api/v2/merchants/' + zapperConfig.merchantId 
      + '/sites/'+ config.zapperConfig.siteId  + '/payments/' + this.shoppingcart.zapperPaymentId;
        axios.get(
          url,
          {headers: {
           // "status": 'HTTP/1.0 200 OK',
            "siteid": "1",
            "poskey": this.poskey,
            "posid": this.posToken,
            "postype": "Paati Passports",
            "posversion": "1.0",
            "signature": signature
            }
          }
          )
          .then((response) => {
              if(response.ReceiptStatus == 2)
              {
                this.shoppingcart.zapperReference = response.ZapperId;
                this.shoppingcart.totalPaid = response.PaidAmount;
                this.setTicket();
              }
            },
            (error) => {
              
            }
          );
    },

    createSecuritySignature: function (posToken,posKey)
    {
      debugger;
      var plainValue =  posToken.concat("&").concat(posKey).toUpperCase();

      var hash =  sha256(plainValue);
      // var enc = Encoding.ASCII;
      // var buffer = enc.GetBytes(plainValue);
      // var crypto = new SHA256CryptoServiceProvider();
      // var hash = BitConverter.ToString(crypto.ComputeHash(buffer));
      hash = hash.Replace("-", "");
      return hash;
    },

    setTicket ()
    {
         let key = this.shoppingcart.pricebreak['.key'];
         let pricebreak = this.pricebreaks[key];
          const sold = Number(pricebreak.sold) + Number(this.shoppingcart.tickets);
          this.$firebaseRefs.pricebreaksRef.child(key).child('sold').set(sold);
         
            for(let i = 0; i < this.shoppingcart.tickets ; i++)
            {
              if(i == 0 && this.shoppingcart.promocode)
              {
                this.processPromoCode(this.shoppingcart.promocode);
              }
              let ref = this.shoppingcart.eventname.substring(0, 4).toUpperCase() +  Math.random().toString(36).substr(2, 9)
              var haspromo = i == 0 && this.shoppingcart.promocode;
              let ticket = {
                  
                  email:  this.user.email,
                  name:  this.userName,
                  userid: this.shoppingcart.userid,
                  eventid: this.shoppingcart.eventid,
                  eventname: this.shoppingcart.eventname,
                  from: this.shoppingcart.from,
                  to: this.shoppingcart.to,
                  pricebreakvalue: this.shoppingcart.pricebreakvalue,
                  price: this.shoppingcart.pricebreakvalue,
                  reference: ref,
                  promocode: haspromo? this.shoppingcart.promocode : "",
                  promotionvalue: haspromo? this.shoppingcart.promotionvalue :0,
                  venuename: this.shoppingcart.venuename,
                  venueaddress: this.shoppingcart.venueaddress,
                  venuelatlong: this.shoppingcart.venuelatlong
                }
                this.tickets.push(ticket);
                 this.$firebaseRefs.ticketsRef.push(ticket);
            }
            this.setConfirmationInfo();
            this.createGuestTickets();
     },

    setConfirmationInfo(){
      
        const reference = 'Purchase reference number: ' + this.shoppingcart.reference;
        const total = String(Number(this.shoppingcart.tickets) * Number(this.shoppingcart.total));
        const numberOfTickets = Number(this.shoppingcart.tickets) > 1? ' tickets at R': ' ticket for R';
        const each = this.shoppingcart.tickets > 1? ' each': '';
        this.message1 = 'You have successfully purchased ' + this.shoppingcart.tickets + numberOfTickets + this.shoppingcart.total + ' for ' + this.shoppingcart.eventname;
        this.message2 = 'The total deducted from your account is R' + total;
        if(this.shoppingcart.tickets > 1)
        {
          this.message3 = 'You have been emailed all the tickets with their QR codes which must be presented at the door by the ticket holder. ' +
          'For your convenience, you may enter the name and email address of the ticket holders and we will email them the ticket as well.';
        }
        else
        {
          this.message3 = 'You will receive an email , with a QR code that needs to be presented at the door of the venue';
        }
        this.isReady = true;
       
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "~@/styles/styles.scss";
  </style>
