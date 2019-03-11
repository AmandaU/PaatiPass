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
import axios from 'axios';
import { sha256, sha224 } from 'js-sha256';

export default {
  name: 'success',

  components: {
    QrcodeVue
  },

  data() {
      return {
        zapperDetails: zapperConfig,
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
      let currentuser = firebase.auth().currentUser;
      var ticketref =  window.location.hash.substring(10,window.location.hash.length) ;
      if(localStorage.getItem(ticketref))
      {
         this.shoppingcart = JSON.parse(localStorage.getItem(ticketref));
         localStorage.removeItem(ticketref);
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
                    // console.log(`all calls done`)
                    if(this.shoppingcart.zapperPaymentMethod)
                    {
                      this.$nextTick(() => {
                        this.getZapperPaymentDetails();
                      });
                     
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
        zapperPaymentId: String(this.shoppingcart.zapperPaymentId),
        payFastRef: this.payFastRef,
        totalPaid: this.shoppingcart.totalPaid,
        total: String(this.totalTicketValue),
        totalTickets: this.totalTickets
      }
        this.$firebaseRefs.invoicesRef.push(invoice);
       
    },

    getZapperPaymentDetails()
    {
      let self = this;
      const url = 'https://zapapi.zapzap.mobi/ecommerce/api/v2/merchants/' + this.zapperDetails.merchantId + '/sites/' + this.zapperDetails.siteId + '/payments/' + this.shoppingcart.zapperPaymentId;
         this.axios.get(
          url,
          {headers: {
           // "status": 'HTTP/1.0 200 OK',
            "siteid": String(this.zapperDetails.siteId),
            "poskey": this.zapperDetails.posKey,
            "posid": this.zapperDetails.posToken,
            "postype": "paatipassports",
            "posversion": "1.0",
            "signature": this.zapperDetails.signature
            }
          }
          )
          .then((response) => {
              if(response.data.statusId == 1)
              {
                var data = response.data.data[0];
                if(!data)return;
                self.shoppingcart.zapperReference = data.ZapperId;
                self.shoppingcart.totalPaid = data.PaidAmount;
                self.setTicket();
              }
            },
            (error) => { 

            }
          );
    },

    createSecuritySignature: function (posToken,posKey)
    {
     var plainValue =  posToken.concat("&").concat(posKey).toUpperCase();
      var hash =  sha256(plainValue);
      hash = hash.replace("-", "");
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
        this.message2 = 'The total deducted from your account is R ' + this.shoppingcart.totalPaid + '.00';
        if(this.totalTickets > 1)
        {
          this.message3 = 'You have been emailed all the tickets with their QR codes which must be presented at the door by the ticket holder. ' ;
        }
        else
        {
          this.message3 = 'You will receive an email with a QR code that needs to be presented at the door of the venue';
        }
        this.isReady = true;
    },
    
  },
};
</script>

<style lang="scss" scoped>
  @import "~@/styles/styles.scss";
  </style>
