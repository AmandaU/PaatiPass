<template>
    <div class="centralcontainer" >
      <div class="centreblock">
    <h1>Your payment was not successful and has been cancelled</h1>
      </div>
    </div>
</template>

<script>
   import firebase from '../firebase-config';
   import {  db } from '../firebase-config';

export default {
  name: 'cancel',

   mounted() {
   
    if(localStorage.getItem(this.$props.ticketref))
      {
         this.shoppingcart = JSON.parse(localStorage.getItem(this.$props.ticketref));
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
       ticketref: {
        type: String,
        required: true,
      }
  },

firebase() {
    
    let pricebreakid = this.shoppingcart.pricebreak.id;
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
        let reserved = Number(pricebreak.reserved - this.shoppingcart.pricebreak.tickets);
        this.$firebaseRefs.pricebreaks.child(pricebreak['.key']).child('reserved').set(reserved);
      }
  }
  
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/styles.scss";
  </style>
