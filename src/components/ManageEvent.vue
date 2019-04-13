<template>
  <div class="centralcontainer">
    <br> <br>
      <div class="centreblock">
        <cube-spin v-if="busy"></cube-spin>
       
            <div class="promoterblock">
                
                <label for="eventname">Event name:</label>
                <input id="eventname" v-model="event.name" placeholder="Name of event">
                <label for="from">Event from:</label>
                <input id="from" type="date" v-model="event.from" placeholder="from">
                 <label for="to">Event to:</label>
                <input id="to" type="date" v-model="event.to" placeholder="to">
                 <label for="image">Event image url:</label>
                 <input id="image" v-model="event.imageurl" placeholder="image url" :disabled="true">
                  <button @click="LoadImage()" >Upload image</button>
                <h3>Venues:</h3>
                 <label for="venuename">Venu name:</label>
                <input id="venuename" v-model="event.venuename" placeholder="venue name" :disabled="true">
                  <label for="venueaddress">Venu address:</label>
                 <input id="venueaddress" v-model="event.venueaddress" placeholder="venue address" :disabled="true">
                  <label for="venuealatlong">Venu location:</label>
                 <input id="venuealatlong" v-model="event.venuelatlong" placeholder="venue location" :disabled="true">
                  <button @click="ChangeVenue()" >Change venue</button>
                  <br>
                  <h3>Pricebreaks:</h3>
                   <div  v-for="pricebreak in pricebreaks" :key="pricebreak['.key']">
                        <label for="pricebreakname">Pricebreak name:</label>  
                        <input id="pricebreakname" v-model="pricebreak.name" placeholder="name">
                        <label for="total">Total tickets:</label>  
                        <input id="total" v-model="pricebreak.number" placeholder="total">
                        <label for="price">Ticket price:</label>  
                        <input id="price" v-model="pricebreak.price" placeholder="price">
                        <label for="sold">Tickets sold:</label>  
                        <input id="sold" v-model="pricebreak.price" placeholder="">
                        <button @click="RemovePriceBreak(pricebreak)" >Remove pricebreak</button>
                   </div>
                   <button @click="AddPriceBreak()" >Add pricebreak</button>
                  <div show="isAddPricebreak">
                    <label for="pricebreakname">Pricebreak name:</label>  
                        <input id="pricebreakname" v-model="newPricebreak.name" placeholder="name">
                        <label for="total">Total tickets:</label>  
                        <input id="total" v-model="newPricebreak.number" placeholder="total">
                        <label for="price">Ticket price:</label>  
                        <input id="price" v-model="newPricebreak.price" placeholder="price">
                     
                    <button @click="SavePricebreak()" >Save pricebreak</button>
                    </div>
            </div>
       
         <button @click="Save()" >Save</button>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import firebase from '../firebase-config';
  import {  db } from '../firebase-config';
  
export default {
  name: 'manageevent',

    props: {
       event: {},
   },

  data() {
      return {
        event: {
          name: "",
          from: "",
          to: "",
          imageurl: "",
          venuename: "",
          venueaddress: "",
          venuenamelatlong: ""
        },
        events: [],
        pricebreaks: [],
        venues: [],
        busy: true,
        isAddPricebreak: false,
        newPricebreak: {}
      }
    },

firebase () {
     this.event =  this.$props.event;
    
    return {
     
      events: {
       source:  db.ref('events').orderByChild("promoterId").equalTo(event.id).limitToFirst(1) ,
          readyCallback: () =>   
          {
            this.busy = false;
            this.event = this.events[0];
         },
       },
       pricebreaks: {
       source:  db.ref('pricebreaks').orderByChild("eventid").equalTo(event.id) ,
          readyCallback: () =>   
          {
            this.busy = false;
         },
       },
       venues: db.ref('venues')
    }
},

created() {
//  var promoter = firebase.auth().currentUser;
//  this.busy = true;
//   this.$bindAsArray(
//             "events",
//             db.ref('events').orderByChild("email").equalTo(currentuser.email),
//             null,
//             () => { });
},

methods: {

ChangeVenue()
{
    //this.$router.replace({ name: 'EventAdmin', params: {event: event}});
},

RemovePriceBreak(pricebreak)
{
  this.$firebaseRefs.users.child(pricebreak).remove();
},

AddPriceBreak()
{
this.isAddPricebreak = true;
},

SavePricebreak(){
this.newPricebreak.eventid = this.event.id;
 this.$firebaseRefs.pricebreaks.push(this.newPricebreak );
},

Save(){
  this.$firebaseRefs.events.push(this.event);
}

}
 


// mounted() {
//  debugger;

//   this.$nextTick(() => {
//       this.getParameterByName();
//       //window.location.href = '/';
//     });

//     let self = this;

//     axios.get(
//     "https://cors-anywhere.herokuapp.com/https://sandbox.payfast.co.za",
//     {headers: {
//        "status": 'HTTP/1.0 200 OK'
//       }
//     }
//   )
//   .then((response) => {
//       self.results = response.data;
//     },
//     (error) => {
//       var status = error.response.status
//     }
//   );

// },

}
</script>

<style lang="scss" scoped>
  @import "~@/styles/styles.scss";
 
  </style>

