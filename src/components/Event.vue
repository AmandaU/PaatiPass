<template>
  <div class="generalcontent">
  
   <div class="column">
     
      <h1>{{ event.name }}</h1>
      <h2>{{ event.from }} - {{ event.to }}</h2>
      <h2>{{ event.venuename }}</h2>
      <small>{{ event.venueaddress }}</small><br>
      <br>
     <cube-spin v-if="busy"></cube-spin>
        <div class="centreblock">
          <div  v-for="pricebreak in pricebreaks" :key="pricebreak['.key'] ">
          <div class="pricebreakrow">

            <div class="pricebreakcolumn1">
                <strong>{{pricebreak.name}} tickets at R {{pricebreak.price}} each </strong>
                
                 <small>{{ total(pricebreak) }}</small><br>
            </div>

            <div  class="pricebreakcolumn2">
                      <h1 v-show="!isTicketsAvailable(pricebreak)" >SOLD OUT !! </h1>
                     
                      <div v-show="isTicketsAvailable(pricebreak)" class="pricebreaknumberrow" >

                         <div  class="ticketselection ">
                            <div v-show="shoppingcart.tickets > 0" class="pricebreakdetailitem"> {{shoppingcart.tickets}}    </div>
                         </div><br>

                          <div  class="ticketselection ">

                            <div  class="pricebreakbuttonbox">
                              <img src="../assets/plus.jpg"  alt="plus"  @click="ticketsSelected(pricebreak,true)" class="pricebreakimage"/>
                              <img src="../assets/minus.png"  alt="minus"  @click="ticketsSelected(pricebreak, false)" class="pricebreakimage"/><br>
                             </div>   
                                <!-- <select 
                                    @change="ticketsSelected($event,pricebreak)" >
                                    <option value="" disabled selected>Select number of tickets</option>
                                    <option v-for="ticket in numberOfTicketsAvailable(pricebreak)" v-bind:key="ticket" v-bind:value="ticket"  >
                                      {{ ticket}}
                                    </option>
                                </select> -->
                          </div> 

                          <div  class="ticketselection " >  
                              <div v-show="shoppingcart.tickets > 0" @click="BuyTickets(pricebreak)" class="pricebreakdetailitem">Buy</div>
                          </div>

                      </div> 
                  
            </div>

           

              
          

        </div>

      
         
          
        </div>
        <br> <br>
        <GoogleMap name="example" :addressCoordinate="addressCoordinate" :venueaddress="event.venueaddress"></GoogleMap>
         <br>
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
  
export default {
  name: 'event',
  components: {
      CubeSpin,
      GoogleMap
  },
 
  data: function () {
    return {
      
      event:{
        name: "",
        from: "",
        to: "",
        venueaname: "",
        venueaddress: "",
        venuelatlong: "",
      },
      busy: false,
      events: [],
      pricebreaks: [],
      shoppingcart: {},
      addressCoordinate: {
        latitude: '',
        longitude: ''
        },
      greaterThan800: window.innerWidth > 800
      }
  },

  firebase () {
     let eventid = Number(window.location.hash.substring(8,9) );
    return {
      promos: db.ref('promotions'),
      tickets: db.ref('tickets'),
      pricebreaks:  db.ref('pricebreaks').orderByChild("eventid").equalTo(eventid) ,
      events: {
        source: db.ref('events').orderByChild("id").equalTo(eventid),
          readyCallback: () =>   
          {
           this.event = this.events[0];
           this.setEvent();
          },
        },
      }
    },
 
  methods: 
  { 

  setEvent()
  {
      this.$eventHub.$emit('eventimageurl', this.event.imageurl);
      let userid =  "";
      
      this.shoppingcart = {
        email: "",
        name: "",
        userid: userid,
        eventid: this.event.id,
        eventname: this.event.name,
        tickets: 0,
        reference: 'JA' + Math.random().toString(36).substr(2, 9),
        from: this.event.from,
        to: this.event.to,
        promocode: "",
        promotionvalue: 0,
        totalPaid: 0,
        number: "0",
        pricebreak: {},
        venuename: this.event.venuename,
        venueaddress: this.event.venueaddress,
        venuelatlong: this.event.venuelatlong,
        zapperPaymentMethod: false,
        zapperPaymentId: 0,
        zapperReference: ""
      };
      this.addressCoordinate.latitude = this.event.venuelatlong.split(',')[0];
      this.addressCoordinate.longitude = this.event.venuelatlong.split(',')[1];
       this.busy = false;
  },

  ticketsSelected: function( pricebreak, add) {
    if(this.shoppingcart.tickets > pricebreak.tickets)
    {
      alert("no more tickets at tis price");
      return;
    }
       this.shoppingcart.tickets = add ? this.shoppingcart.tickets + 1 :this.shoppingcart.tickets - 1;
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
  },
 
};
</script>

<style lang="scss" scoped>
  @import "~@/styles/styles.scss";
 </style>

