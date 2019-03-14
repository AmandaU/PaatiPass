<template>
  <div class="centralcontainer">
    <div class="centreblock">
      <h1>{{ event.name }}</h1>
      <h2>{{ event.from }} - {{ event.to }}</h2>
      <h2>{{ event.venuename }}</h2>
      <small>{{ event.venueaddress }}</small><br>
      <br>
      <cube-spin v-if="busy"></cube-spin>
      <div class="eventblock">
          <br>
           <div class="pricebreakblock">
             <div  v-for="pricebreak in pricebreaks" :key="pricebreak['.key'] ">
              <div class="pricebreakrow">
            
                <div class="pricebreakcolumn1">
                  <strong>{{pricebreak.name}} tickets at R {{pricebreak.price}} each </strong>
                  <small>{{ total(pricebreak) }}</small>
                </div>

                <div  class="pricebreakcolumn2">
                     <div v-show="!isTicketsAvailable(pricebreak)" class="pricebreakdetailitem">SOLD OUT !! </div>
                
                     <div v-show="isTicketsAvailable(pricebreak)" class="pricebreaknumberrow" >

                        <div  class="ticketselection ">
                          <div  v-show="pricebreak.tickets> 0" class="pricebreakdetailitem"> {{pricebreak.tickets}}</div>
                        </div>  
                        <br>

                        <div  class="pricebreakbuttonbox">
                          <img src="../assets/plus.jpg"  alt="plus"  @click="ticketsSelected(pricebreak,true)" class="pricebreakimage"/>
                          <img v-show="pricebreak.tickets > 0" src="../assets/minus.png"  alt="minus"  @click="ticketsSelected(pricebreak, false)" class="pricebreakimage"/><br>
                        </div>   
                  
                    </div> 
                </div>  

                 <div class="thinline"></div>  

              </div> 
             </div> 
           </div>

          <div class="shoppingcartblock">
             <div class="checkoutblock">
              <h2>Checkout</h2>

              <div  v-for="pricebreak in pricebreaks" :key="pricebreak['.key'] ">
                <div  class="checkoutrow ">
                
                  <div  class="checkouttickets ">
                    <small>{{pricebreak.name}}: {{pricebreak.tickets}}</small>
                  </div>

                  <div  class="checkouttickettotal ">
                    <small>{{totalTicketValueForPriceBreak(pricebreak)}}</small>
                  </div> 

                </div>  
              </div>
              <br>

                <div  class="checkoutrow ">
                    <div  class="checkouttickets "/>
                    <div  class="checkouttickettotal "> 
                      <div class="thinline"></div>  
                    </div> 
                </div> 

                <div  class="checkoutrow ">
                  <div  class="checkouttickets ">
                      <small>Total: {{totalTickets}}</small>
                  </div>

                  <div  class="checkouttickettotal "> 
                    <small>{{totalTicketValue}}</small>
                    </div>
                </div> 
              
                <br> 
                
                <div v-show="totalTickets > 0" @click="BuyTickets()" class="buybutton">Buy</div>
              
            </div>  
          </div> 

      </div> 
  
      <br> <br>
      <GoogleMap  name="example" :addressCoordinate="addressCoordinate" :venueaddress="event.venueaddress"></GoogleMap>
      <br>
    </div>
  </div>
  
</template>

<script>
  import CubeSpin from 'vue-loading-spinner/src/components/ScaleOut'
  import firebase from '../firebase-config';
  import {  db } from '../firebase-config';
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
      pricebreaks: {
       source:  db.ref('pricebreaks').orderByChild("eventid").equalTo(eventid) ,
          readyCallback: () =>   
          {
           this.pricebreaks.forEach((pricebreak) => {
              pricebreak.ticketHolders = [];
           });
         },
      },
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
      var currentUser = firebase.auth().currentUser;
      
      this.shoppingcart = {
        email: currentUser? currentUser.email: "",
        name: "",
        userid: currentUser? currentUser.uid: "",
        event: this.event,
        reference: 'JA' + Math.random().toString(36).substr(2, 9),
        promocode: "",
        promotionvalue: 0,
        totalPaid: 0,
        number: "0",
        pricebreaks: [],
        zapperPaymentMethod: false,
        zapperPaymentId: 0,
        zapperReference: ""
      };
      this.addressCoordinate.latitude = this.event.venuelatlong.split(',')[0];
      this.addressCoordinate.longitude = this.event.venuelatlong.split(',')[1];
       this.busy = false;
  },

  ticketsSelected: function( pricebreak, add) {
   if(pricebreak.tickets == 0 && !add)return;
    if(pricebreak.tickets + pricebreak.sold > pricebreak.number)
    {
      alert("no more tickets at this price");
      return;
    }
     if(add ){
       var ticket = {
              name : "",
              email: "",
       };
       pricebreak.ticketHolders.push(ticket);
     }
     else if(pricebreak.ticketHolders.length > 0)
     {
       pricebreak.ticketHolders.pop();
     }
   pricebreak.tickets = pricebreak.ticketHolders.length;
  },

  BuyTickets: function() {
      // this.busy = true;
      //  var key = pricebreak['.key'];
     
      //  let totalreserved  = Number(pricebreak.reserved) + Number(pricebreak.tickets);
      //  if(totalreserved > Number(pricebreak.number))
      //  {
      //    let n = (totalreserved - Number(pricebreak.number));
      //    if(n == 1)
      //    {
      //      alert('There is only 1 ticket left at this price');
      //    }
      //    else
      //    {
      //      alert('There are ' + String(n) + ' tickets at this price, that are reserved. Please choose another price break or try again later');
      //      return;
      //    }
      //  }
       
      //   this.shoppingcart.pricebreak = pricebreak;
      //   this.$firebaseRefs.pricebreaks.child(key).child('reserved').set(String(totalreserved));

       var filteredData =   this.pricebreaks.filter(function(pb) {
            return pb.tickets > 0;
          });
        this.shoppingcart.pricebreaks = filteredData;
        const currentUser = firebase.auth().currentUser;
        localStorage.setItem(this.shoppingcart.reference, JSON.stringify(this.shoppingcart));
        if (!currentUser)
        {
          this.$router.replace({ name: 'Login', params: {ticketref: this.shoppingcart.reference}});
        } 
        else
        {
           this.$router.replace({ name: 'Checkout', query: {ticketref: this.shoppingcart.reference}});
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
         
  total : function(pricebreak) {
      if(this.isTicketsAvailable(pricebreak))
      {
         if( pricebreak.tickets == 0) return  "";
          let total = Number(pricebreak.tickets) * Number(pricebreak.price);
          return 'You will purchase  ' +  pricebreak.tickets + ' at R' + pricebreak.price + ' each. The total is' + String('R ' + total + '.00');
      }
    },

   isTicketsAvailable : function(pricebreak) {
     if(Number(pricebreak.reserved) == 0 && Number(pricebreak.sold == 0))
      {
        return true;
      }
        return Number(pricebreak.sold) < Number(pricebreak.number);
     },

    totalTicketValueForPriceBreak: function(pricebreak){
      var value = Number(pricebreak.tickets * pricebreak.price);
      return value == 0? "R 0.00": String('R ' + value + '.00');
    },

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

    totalTickets: function()
    {
      var total = 0;
      this.pricebreaks.forEach(element => {
          total += element.tickets;
       });
      return total ; 
   },

    totalTicketValue: function()
    {
      var value = 0;
      this.pricebreaks.forEach(element => {
        
         value += Number(element.tickets * element.price);
        
      });
      return value == 0? "R 0.00": String('R ' + value + '.00');
    },
 }
 
};
</script>

<style lang="scss" scoped>
  @import "~@/styles/styles.scss";
 </style>

