<template>
  <div class="about">
    <h1>This is an about page</h1>
     <div v-html="results"/>
  </div>
</template>

<script>
  //  import firebase from '../firebase-config';
  //  import {  db } from '../firebase-config';

  //  let myEventsRef = db.ref('events')

  import axios from "axios";

export default {
  name: 'about',

  data() {
      return {
         results: [],
        busy: false,
       
      }
    },

firebase () {
        return {
          //events: myEventsRef    
        }
      },

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

  methods: {

   getParameterByName() {
     var thing = window.location.hash;
  // let match = RegExp('[#&]' + name + '=([^&]*)').exec(window.location.hash);
  // return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

      
  },
  
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/styles.scss";
  </style>

