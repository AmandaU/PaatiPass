<template>
  <div class="generalcontent">
    <h1>Your payment was not successful and has been cancelled</h1>
    
  </div>
</template>

<script>
   import firebase from '../firebase-config';
   import {  db } from '../firebase-config';

export default {
  name: 'cancel',

   mounted() {
   
    if(localStorage.getItem(this.$props.ticketid))
      {
         this.shoppingcart = JSON.parse(localStorage.getItem(this.$props.ticketid));
       }
   },

  data() {
      return {
        busy: false,
        shoppingcart: '',
        tickets: '',
        pricebreak: ''
        
      }
    },

      props: {
       ticketid: {
        type: String,
        required: true,
      }
  },

firebase() {
    
    let pricebreakid = this.shoppingcart.pricebreakid;
        return {
          pricebreaks: {
            source: db.ref('pricebreaks'),//.orderByChild("id").equalTo(this.$props.pricebreakid).limitToFirst(1),
            asObject: true,
                readyCallback: () =>   
                {
                  this.pricebreak = this.pricebreaks[pricebreakid];
                 UpdateData();
                }
              },
         }
      },

  methods: {
     UpdateData()
      {
        let reserved = Number(pricebreak.reserved - this.shoppingcart.tickets);
        this.$firebaseRefs.pricebreaks.child(pricebreak['.key']).child('reserved').set(reserved);
      }
  }
  
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/styles.scss";
  </style>
