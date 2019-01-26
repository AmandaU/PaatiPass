<template>
  <div class="notify">
    <h1>This is the notify page</h1>
     <div v-html="results"/>
  </div>
</template>

<script>
  //  import firebase from '../firebase-config';
  //  import {  db } from '../firebase-config';

  //  let myEventsRef = db.ref('events')

  import axios from "axios";

export default {
  name: 'notify',

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

mounted() {
 debugger;

  this.$nextTick(() => {
      this.getParameterByName();
      //window.location.href = '/';
    });

    let self = this;

    axios.get(
    "https://cors-anywhere.herokuapp.com/https://sandbox.payfast.co.za",
    {headers: {
       "status": 'HTTP/1.0 200 OK'
      }
    }
  )
  .then((response) => {
      self.results = response.data;
    },
    (error) => {
      var status = error.response.status
    }
  );

// axios("https://cors-anywhere.herokuapp.com/https://sandbox.payfast.co.za", {
 
//       method: 'POST',
//       mode: 'no-cors',
//       headers: {
//        status: 'HTTP/1.0 200 OK'
//       },
    
//     })
//     .then(result => {
//     self.results = result.data;
//          }, error => {
         
//           var st = error.status;
//         });

//         return;

    // axios({ method: "GET", "url": "https://httpbin.org/ip" }).then(result => {
    //     this.ip = result.data.origin;
    // }, error => {
    //     console.error(error);
    // });
   
//    axios.interceptors.response.use((config) => {
//   let thing = config.data;
//   return config;
// });

    //  axios({ method: "GET", "url": "https://httpbin.org/ip" }).then(result => {
    //     this.ip = result.data.origin;
    // }, error => {
    //     console.error(error);
    // });
},

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

