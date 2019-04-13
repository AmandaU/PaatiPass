<template>
  <div class="centralcontainer">
    <br> <br>
     <div class="centreblock">
        <cube-spin v-if="busy"></cube-spin>
        <div  v-for="event in events" :key="event['.key']">
            <div class="promoterblock">
                <h2 >{{ event.name }}</h2>
                <small class="promoteritem">{{ event.from }} - {{ event.to }}</small>
                <small class="promoteritem">{{ event.venuename }}</small>
                <small class="promoteritem">{{ event.venueaddress }}</small>
                <small class="promoteritem">{{ event.venuelatlong }}</small><br>
                <button class="promotioneditbutton" @click="EditEvent(event)" >edit</button>
            </div>
            <br>
       
        </div>
         <button class="promotionnewbutton" @click="NewEvent()" >New</button>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import firebase from '../firebase-config';
  import {  db } from '../firebase-config';
  
export default {
  name: 'promoter',

  data() {
      return {
         events: [],
         pricebreaks: [],
         venues: [],
         busy: true,
       
      }
    },

firebase () {
    debugger;
      var promoter = firebase.auth().currentUser;
    return {
     
      events: {
       source:  db.ref('events').orderByChild("promoterid").equalTo(promoter.uid) ,
          readyCallback: () =>   
          {
            this.busy = false;
         },
       },
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

EditEvent(event)
{
  debugger;
    this.$router.replace({ name: 'ManageEvent', params: {event: event}});
},

NewEvent()
{
    this.$router.replace({ name: 'ManageEvent'});
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

