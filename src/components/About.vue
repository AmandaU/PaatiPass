<template>
  <div class="generalcontent" >
    <h1>This is an about page</h1>
    
  </div>
</template>

<script>
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

created() {
  this.$eventHub.$emit('eventimageurl', '');
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

}
</script>

<style lang="scss" scoped>
  @import "~@/styles/styles.scss";
 
  </style>

