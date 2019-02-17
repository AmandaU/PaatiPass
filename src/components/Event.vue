<template>
  <div class="generalcontent">
  <br><br>
   <div class="centreblock">
     <cube-spin v-if="busy"></cube-spin>
      <h1>{{ eventdata.name }}</h1>
      <h2>{{ eventdata.from }} - {{ eventdata.to }}</h2>
      <h2>{{ eventdata.venuename }}</h2>
      <small>{{ eventdata.venueaddress }}</small><br>
      <small>{{eventdata.venuelatlong}}</small><br>
      <cube-spin v-if="busy"></cube-spin>
    
      <div  v-for="pricebreak in pricebreaks" :key="pricebreak['.key'] ">
          <div  class="box">
               <strong>{{pricebreak.name}}</strong>
                <strong> R {{pricebreak.price}}</strong>
                 <h1 v-show="!isTicketsAvailable(pricebreak)">SOLD OUT !! </h1>
               <div v-show="isTicketsAvailable(pricebreak)" >
                  <small>{{ total(pricebreak) }}</small><br>
                  <select 
                      @change="ticketsSelected($event,pricebreak)" >
                      <option value="" disabled selected>Select number of tickets</option>
                      <option v-for="ticket in numberOfTicketsAvailable(pricebreak)" v-bind:key="ticket" v-bind:value="ticket"  >
                        {{ ticket}}
                      </option>
                  </select>
                  <br>
                    <button v-show="shoppingcart.tickets > 0" @click="BuyTickets(pricebreak)" >Buy</button>
              </div>
        </div>
        <br>
        <GoogleMap name="example" :addressCoordinate="addressCoordinate" :venueaddress="eventdata.venueaddress"></GoogleMap>
        
      </div>
  </div>
  
  </div>
</template>

<script>
  import CubeSpin from 'vue-loading-spinner/src/components/ScaleOut'
  import firebase from '../firebase-config';
  import {  db } from '../firebase-config';
  import {zapperConfig} from '../config';
  import GoogleMap from '../components/GoogleMap'
  
  let myEventsRef = db.ref('events')
  let myPromotions = db.ref('promotions')
 
export default {
  name: 'event',
  components: {
      CubeSpin,
      GoogleMap
  },
  props: {
     isbusy: true,
      shared: "",
      eventdata: {
        type: Object,
        required: true 
      },
  },

  firebase () {
    let  eventid = String(this.$props.eventdata.id) 
    return {
      
      promos: myPromotions,
      tickets: db.ref('tickets'),
      events: myEventsRef,
      pricebreaks:  db.ref('pricebreaks').orderByChild("eventid").equalTo(eventid) ,
      
      }
    },

  data : function ()  {
    return {
      busy: false,
      events: [],
      pricebreaks: [],
      shoppingcart: {},
      title : '',
      address: '',
      addressCoordinate: {
        latitude: '',
        longitude: ''
        },
      price: '',
      greaterThan800: window.innerWidth > 800
      }
  },

  methods: 
  { 
  ticketsSelected: function(event, pricebreak) {
       this.shoppingcart.tickets = Number(event.target.value);
       this.shoppingcart.pricebreak = pricebreak;
    },

  BuyTickets: function(pricebreak) {
       this.busy = true;
        var key = pricebreak['.key'];
     
       let totalreserved  = Number(pricebreak.reserved) + Number(this.shoppingcart.tickets);
       if(totalreserved > Number(pricebreak.number))
       {
         let n = (totalreserved - Number(pricebreak.number));
         if(n == 1)
         {
           alert('There is only 1 ticket left at this price');
         }
         else
         {
           alert('There are ' + String(n) + ' tickets at this price, that are reserved. Please choose another price break or try again later');
           return;
         }
       }
        this.shoppingcart.total  = String(Number(this.shoppingcart.tickets) * Number(pricebreak.price));
        this.shoppingcart.pricebreakvalue = pricebreak.price;
        this.shoppingcart.pricebreakkey = key;
        this.shoppingcart.pricebreakreserved = pricebreak.reserved;
        this.$firebaseRefs.pricebreaks.child(key).child('reserved').set(String(totalreserved));

        this.busy = false;
        const currentUser = firebase.auth().currentUser;
        
        if (!currentUser)
        {
          this.$router.replace({ name: 'Login', params: {shoppingcart: this.shoppingcart}});
        } 
        else
        {
          this.$router.replace({ name: 'Checkout', params: {shoppingcart: this.shoppingcart}});
        }
       
      },

  media800Enter(mediaQueryString) {
    this.greaterThan800 = false
  },
  
  media800Leave(mediaQueryString) {
    this.greaterThan800 = true
  },

  addItem() {
      // this.$firebaseRefs.pricebreaks.push({
      //                 order: '0',
      //                 eventid: '1',
      //                 price: '100',
      //                 number: '120',
      //                 reserved: '0',
      //                 sold: '0'
      //   })
   
    // this.$firebaseRefs.promos.push({
    //                   code: 'P12345',
    //                   closed: false
    //     })

     this.$firebaseRefs.venues.push({
                      name: "Nice wine farm",
                      address: "6 Party Road, Winelands, Cape Town",
                      lat: "33.234567",
                      long: "34.99876"
        });
         this.$firebaseRefs.venues.push({
                      name: "Hot Cape Town Club",
                      address: "2 Long ST, Cape Town",
                      lat: "33.234567",
                      long: "34.99876"
        })
      },

  numberOfTicketsAvailable(pricebreak)
  {
    let ticketNumber = [];
    let available = Number(pricebreak.number ) - Number(pricebreak.sold);
    for (let i = 1; i < available; i++) { 
      if(i == 11) break;
        ticketNumber[i] = String(i);
    }
    return ticketNumber;
  },
          
  total : function(pricebreak) {
      if(this.isTicketsAvailable(pricebreak))
      {
        if(this.shoppingcart.pricebreak && this.shoppingcart.pricebreak.id == pricebreak.id)
        {
          if(this.shoppingcart.tickets == 0) return  "";
          let total = Number(this.shoppingcart.tickets) * Number(pricebreak.price);
          return 'You will purchase  ' +  this.shoppingcart.tickets + ' at R' + pricebreak.price + ' each. The total is R' + total;
        }
      }
    },

    isTicketsAvailable : function(pricebreak) {
     if(Number(pricebreak.reserved) == 0 && Number(pricebreak.sold == 0))
      {
        return true;
      }
        return Number(pricebreak.sold) < Number(pricebreak.number);
      },
  },

created() {
 
 this.$eventHub.$emit('eventimageurl', this.eventdata.imageurl);
      let userid =  "";
      if(firebase.auth().currentUser)
      {
        userid = firebase.auth().currentUser.uid;
      }
      this.shoppingcart = {
        email: "",
        name: "",
        userid: userid,
        eventid: this.eventdata.id,
        eventname: this.eventdata.name,
        tickets: 0,
        reference: 'JA' + Math.random().toString(36).substr(2, 9),
        from: this.eventdata.from,
        to: this.eventdata.to,
        promocode: "",
        promotionvalue: 0,
        totalPaid: 0,
        number: "0",
        pricebreak: {},
        venuename: this.eventdata.venuename,
        venueaddress: this.eventdata.venueaddress,
        venuelatlong: this.eventdata.venuelatlong,
        zapperPaymentMethod: false,
        zapperPaymentId: 0,
        zapperReference: ""
      };
      this.addressCoordinate.latitude = this.eventdata.venuelatlong.split(',')[0];
      this.addressCoordinate.longitude = this.eventdata.venuelatlong.split(',')[1];
    },
 
};
</script>

<style lang="scss" scoped>
  @import "~@/styles/styles.scss";
 </style>

