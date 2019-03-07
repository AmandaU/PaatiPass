<template>
  <div class="success">
     <div class="centralcontainer" >
        <div class="centreblock">
          <br>
          <h1>Your payment was successful</h1>
          <cube-spin v-if="isReady"></cube-spin>
          <h3>{{message1}}</h3>
          <h3>{{message2}}</h3>
          <h3>{{message3}}</h3>
          <br>
        </div>
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
        payFastRef: "",
        guests: [],
        users: [],
        user: {},
        pricebreaks:{},
        promotion: [],
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
           invoicesRef: db.ref('invoices'),
           ticketsRef: db.ref('tickets'),
           pricebreaksRef: db.ref('pricebreaks'),
           promotionsRef: db.ref('promotions')
         }
      },

  computed: {

    userName: function () {
      return this.user.firstname + ' ' + this.user.surname;
    },
   
    totalTickets: function () {
      var total = 0;
      this.shoppingcart.pricebreaks.forEach(element => {
        total += element.tickets;
      });
      return total;
   },

  totalTicketValue: function () {
      var value = 0;
      this.shoppingcart.pricebreaks.forEach(element => {
        value += Number(element.tickets * element.price);
      });
      return value ;
    },
  },

  created(){
    debugger;
      let currentuser = firebase.auth().currentUser;
      if(localStorage.getItem(this.$props.ticketid))
      {
         this.shoppingcart = JSON.parse(localStorage.getItem(this.$props.ticketid));
         this.shoppingcart.userid = currentuser.uid;
         this.shoppingcart.email = currentuser.email;
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
                      this.shoppingcart.totalPaid =   String(this.totalTicketValue - this.shoppingcart.promotionvalue);
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

    createInvoice()
    {
      this.processPromoCode(this.shoppingcart.promocode);
      var initials = this.user.firstname.substring(0,1).toUpperCase() + this.user.surname.substring(0,1).toUpperCase();
      var ref = initials + Math.random().toString(36).substr(2, 9);
      
      var invoice = {
        reference: ref,
        eventid: this.shoppingcart.event.id,
        eventname: this.shoppingcart.event.name,
        userid: this.user.uid,
        email: this.user.email,
        promocode: this.shoppingcart.promocode ,
        promotionvalue: this.shoppingcart.promotionvalue ,
        zapperRef: String(this.shoppingcart.zapperReference),
        payFastRef: this.payFastRef,
        totalPaid: this.shoppingcart.totalPaid,
        total: String(this.totalTicketValue),
        totalTickets: this.totalTickets
      }
        this.$firebaseRefs.invoicesRef.push(invoice);
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
                this.shoppingcart.zapperPaymentId = response.ZapperId;
                this.shoppingcart.totalPaid = response.PaidAmount;
                this.setTicket();
              }
            },
            (error) => { }
          );
    },

    createSecuritySignature: function (posToken,posKey)
    {
      var plainValue =  posToken.concat("&").concat(posKey).toUpperCase();
      var hash =  sha256(plainValue);
      hash = hash.Replace("-", "");
      return hash;
    },

    setTicket ()
    {
       this.shoppingcart.pricebreaks.forEach(pricebreak => {
 
         let key = pricebreak['.key'];
         const sold = Number(pricebreak.sold) + Number(pricebreak.tickets);
         this.$firebaseRefs.pricebreaksRef.child(key).child('sold').set(sold);
          for(var holderkey in  pricebreak.ticketHolders )
          {
            var holder = pricebreak.ticketHolders[holderkey];
           
            let ref = this.shoppingcart.event.name.substring(0, 4).toUpperCase() +  Math.random().toString(36).substr(2, 9)
            let qrcode = ref + '|' + this.userName + '|' + this.user.email + '|' + holder.name + '|' + holder.email;
            
            let ticket = {
                ccemail: holder.email ==  ""? "" : this.user.email,
                email:  holder.email == ""? this.user.email: holder.email,
                holdername:  holder.name == ""? this.userName: holder.name,
                buyername:  this.userName,
                userid: this.shoppingcart.userid,
                eventid: this.shoppingcart.event.id,
                eventname: this.shoppingcart.event.name,
                from: this.shoppingcart.event.from,
                to: this.shoppingcart.event.to,
                price: pricebreak.price ,
                reference: ref,
                qrcode: qrcode,
                venuename: this.shoppingcart.event.venuename,
                venueaddress: this.shoppingcart.event.venueaddress,
                venuelatlong: this.shoppingcart.event.venuelatlong,
                used: false
              }
                this.$firebaseRefs.ticketsRef.push(ticket);
            }
     });
     
        this.setConfirmationInfo();
        this.createInvoice();
     },

    setConfirmationInfo(){
         const reference = 'Purchase reference number: ' + this.shoppingcart.reference;
        var total = String(this.totalTicketValue - this.shoppingcart.promotionvalue);
        var numberOfTickets = this.totalTickets > 1? ' tickets': ' ticket';
        var each = this.totalTickets > 1? ' each': '';
        this.message1 = 'You have successfully purchased ' + this.totalTickets + numberOfTickets +  ' for ' + this.shoppingcart.event.name +'. ' ;
        if(this.shoppingcart.promocode)
        {
          this.message1 += ' You used your promotion code (' + this.shoppingcart.promocode + ') to the value of R' + this.shoppingcart.promotionvalue;
        }
        this.message2 = 'The total deducted from your account is R ' + total + '.00';
        if(this.totalTickets > 1)
        {
          this.message3 = 'You have been emailed all the tickets with their QR codes which must be presented at the door by the ticket holder. ' ;
        }
        else
        {
          this.message3 = 'You will receive an email with this QR code that needs to be presented at the door of the venue';
        }
        this.isReady = true;
    },
    
  },
};
</script>

<style lang="scss" scoped>
  @import "~@/styles/styles.scss";
  </style>
