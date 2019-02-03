<template>
  <div class="success">
    <h1>Your payment was successful</h1>
    <p>{{message1}}</p>
    <p>{{message2}}</p>
    <p>{{message3}}</p>
    
    <br>
      <div class="centreblock">
       <div  v-for="ticket in tickets" :key="ticket.reference">
        <div  class="box">
            <input type="text" v-model="ticket.name" v-bind:placeholder="[[ticket.name]]"><br>
            <input type="email" v-model="ticket.email" v-bind:placeholder="[[ticket.email]]"><br>
            <qrcode-vue  :value="ticket.reference"></qrcode-vue>'
        </div>
      </div>
        <button v-show="isReady" @click="sendTickets()" >Email the tickets</button>
   </div>
    
   </div>
</template>

<script>
import firebase from '../firebase-config';
import {  db } from '../firebase-config';
import QrcodeVue from 'qrcode.vue';

export default {
  name: 'success',

  components: {
    QrcodeVue
  },

  data() {
      return {
        users: [],
        user: {},
        pricebreaks:{},
        promotion: {},
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
           tickets: db.ref('tickets'),
           pricebreaksRef: db.ref('pricebreaks')
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
                     this.setTicket();
                  }
                );

              }
          );

      }
    },

methods: {

    BuyTickets() {
       this.$router.replace({ name: 'Home'});
    },

    setConfirmationInfo(){
      
        const reference = 'Purchase reference number: ' + this.shoppingcart.reference;
        const total = String(Number(this.shoppingcart.tickets) * Number(this.shoppingcart.total));
        const numberOfTickets = Number(this.shoppingcart.tickets) > 1? ' tickets at R': ' ticket for R';
        const each = Number(this.shoppingcart.tickets) > 1? ' each': '';
        this.message1 = 'You have successfully purchased ' + this.shoppingcart.tickets + numberOfTickets + this.shoppingcart.total + ' for ' + this.shoppingcart.eventname;
        this.message2 = 'The total deducted from your account is R' + total;
        if(Number(this.shoppingcart.tickets) > 1)
        {
          this.message3 = 'Please confirm the email address and name of the ticket holder for each ticket. If you do not change the email address and name then you will receive all the emails. ' +
          ' You will then need to forward the emails to the people you are purchasing the ticket for. There will be a QR code in each email that needs to be presented at the door of the venue.';
        }
        else
        {
          this.message3 = 'You will receive an email , with a QR code that needs to be  presented at the door of the venue';
        
        }
        this.isReady = true;
    },

    processpromoCode(promo)
    {
       this.$bindAsObject(
                  "promotion",
                  db.ref('promotions').orderByChild("code").equalTo(promo.code) ,
                  null,
                  () => {
                    debugger;
                    this.promotion.redeemed += 1;
                    let key = this.promotion['.key'];
                    this.db.ref('promotions').child(key).child('redeemed').set(this.promotion.redeemed);
                  }
                );
    },

    setTicket ()
    {
     
         let key = this.shoppingcart.pricebreak['.key'];
         let pricebreak = this.pricebreaks[key];
          const sold = Number(pricebreak.sold) + Number(this.shoppingcart.tickets);
          this.$firebaseRefs.pricebreaksRef.child(key).child('sold').set(sold);
  
            for(let i = 0; i < this.shoppingcart.tickets ; i++)
            {
              debugger;
              if(i == 0 && this.shoppingcart.promocode)
              {
                this.processPromoCode(this.shoppingcart.promocode);
              }
              let ref = this.shoppingcart.eventname.substring(0, 4).toUpperCase() +  Math.random().toString(36).substr(2, 9)
              let ticket = {
                  
                  email: i > 0? "": this.user.email,
                  name: i > 0? "": this.user.firstname + ' ' + this.user.surname,
                  userid: this.shoppingcart.userid,
                  eventid: this.shoppingcart.eventid,
                  eventname: this.shoppingcart.eventname,
                  from: this.shoppingcart.from,
                  to: this.shoppingcart.to,
                  pricebreakvalue: this.shoppingcart.pricebreakvalue,
                  total: this.shoppingcart.pricebreakvalue - i > 0? 0: this.shoppingcart.promotionvalue,
                  reference: ref,
                  promocode: this.shoppingcart.promocode,
                  promotionvalue: '',
                  venuename: this.shoppingcart.venuename,
                  venueaddress: this.shoppingcart.venueaddress,
                  venuelatlong: this.shoppingcart.venuelatlong
                 
                }
                this.tickets.push(ticket);
            }
           this.setConfirmationInfo();
       
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "~@/styles/styles.scss";
  </style>
