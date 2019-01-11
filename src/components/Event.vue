<template>
  <div class="hello">
   <h1>{{ eventdata.name }}</h1>
   <h2>{{ eventdata.address }}</h2>
   <cube-spin v-if="busy"></cube-spin>
     <div class="centreblock">
    <div  v-for="pricebreak in pricebreaks" :key="pricebreak['.key']">
    
          <div  class="box">
              <strong>{{pricebreak.name}}</strong>
                <strong> R {{pricebreak.price}}</strong>
                <br>
                <small>{{ total(pricebreak) }}</small>
              <div v-if="isTicketsAvailable(pricebreak)">
               <select 
                  @change="ticketsSelected($event,pricebreak)" >
                  <option value="" disabled selected>Select number of tickets</option>
                  <option v-for="ticket in numberOfTicketsAvailable(pricebreak)" v-bind:key="ticket" v-bind:value="ticket"  >
                    {{ ticket}}
                  </option>
               </select>
                <br>
                  <button @click="BuyTickets(pricebreak)" >Buy</button>
              </div>
           
            </div>
      </div>
  </div>
  
   <!-- <button @click="fetchEvent" >Fetch</button> -->
    <!-- <p>
      For a guide and recipes on how to configure / customize this project,<br>
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
    </p>
    <h3>Installed CLI Plugins</h3>
    <ul>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel" target="_blank" rel="noopener">babel</a></li>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint" target="_blank" rel="noopener">eslint</a></li>
    </ul>
    <h3>Essential Links</h3>
    <ul>
      <li><a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank" rel="noopener">Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank" rel="noopener">Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank" rel="noopener">Twitter</a></li>
      <li><a href="https://news.vuejs.org" target="_blank" rel="noopener">News</a></li>
    </ul>
    <h3>Ecosystem</h3>
    <ul>
      <li><a href="https://router.vuejs.org" target="_blank" rel="noopener">vue-router</a></li>
      <li><a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a></li>
      <li><a href="https://github.com/vuejs/vue-devtools#vue-devtools" target="_blank" rel="noopener">vue-devtools</a></li>
      <li><a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">awesome-vue</a></li>
    </ul> -->
  </div>
</template>

<script>
  import CubeSpin from 'vue-loading-spinner/src/components/ScaleOut'
  
  import firebase from '../firebase-config';
  import {  db } from '../firebase-config';
  
  let myUsersRef = db.ref('users')
  let myEventsRef = db.ref('events')
   
  let idparam = '';
  let title = '';
  let event = '';

export default {
  name: 'event',
  components: {
      CubeSpin
    },
  props: {
       eventdata: {
        type: Object,
        required: true // User can accept a userData object on params, or not. It's totally optional.
      }
  },

  watch: {
  pricebreaks: {
    deep: true,
    handler(newArray) {
        console.log( 'Change detected...' );
    } 
  }
},

  firebase () {
    let  eventidd = String(this.$props.eventdata.id) 
    return {
      tickets: db.ref('tickets'),
       events: myEventsRef,//myEventsRef, // loopable with v-for
       eventsObj: { // can use keys, but v-for doesn't loop
        source: myEventsRef,
        asObject: true
        },
       pricebreaks:  db.ref('pricebreaks').orderByChild("eventid").equalTo(eventidd) ,
       pricebreaksObj: { // can use keys, but v-for doesn't loop
        source: db.ref('pricebreaks').orderByChild("eventid").equalTo(eventidd),
        asObject: true
        },
       }
      },

  data : function ()  {
    return {
      busy: false,
      events: [],
      pricebreaks: [],
      ticket: {
        userid: '',
        eventid: '',
        pricebreakid: '',
        tickets: '0'
      },
      title : '',
      address: '',
      price: '',
      greaterThan800: window.innerWidth > 800
      }
  },

  methods: 
{ 
  ticketsSelected: function(event, pricebreak) {
       this.ticket.tickets = event.target.value;
       this.ticket.pricebreakid = pricebreak.id;
    },

    BuyTickets: function(pricebreak) {

       this.busy = true;
        
        var key = pricebreak['.key'];
     
       let totalreserved  = Number(pricebreak.reserved) + Number(this.ticket.tickets);
       if(totalreserved > Number(pricebreak.number))
       {
         let n = (totalreserved - Number(pricebreak.number));
          alert('There are only ' + String(n) + 'tickets left at this price');
          return;
       }
        this.ticket.total  = String(Number(this.ticket.tickets) * Number(pricebreak.price));
        this.$firebaseRefs.pricebreaks.child(key).child('reserved').set(String(totalreserved));

         this.busy = false;

        const currentUser = firebase.auth().currentUser;

        if (!currentUser)
        {
          this.$router.replace({ name: 'Login', params: {ticketdata: this.ticket, pricebreakdata: pricebreak}});
        }
        else
        {
          this.$router.replace({ name: 'Checkout', params: {ticketdata: this.ticket, pricebreakdata: pricebreak}});
        }
        
       
       
      },

   media800Enter(mediaQueryString) {
      this.greaterThan800 = false
    },
    media800Leave(mediaQueryString) {
      this.greaterThan800 = true
    },

    updateItem() {
      this.$firebaseRefs.events.child(this.$route.params.id).set(this.event);
    },

    deleteItem(key) {
      this.$firebaseRefs.events.child(key).remove();
    },

    addItem() {
     this.$firebaseRefs.pricebreaks.push({
                      order: '0',
                      eventid: '1',
                      price: '100',
                      number: '120',
                      reserved: '0',
                      sold: '0'
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
        if(this.ticket.pricebreakid == pricebreak.id)
        {
          if(this.ticket.tickets == 0) return  "";
          let total = Number(this.ticket.tickets) * Number(pricebreak.price);
          return 'You will purchase  ' +  this.ticket.tickets + ' at R' + pricebreak.price + ' each. The total is R' + total;
        }
      }
      else
      {
        return "SOLD OUT!";
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

   computed: {
  
},

created() {
   let user = firebase.auth().currentUser;
    this.ticket = {
        email: user.email,
        userid: user.uid,
        eventid: this.eventdata.id,
        eventname: this.eventdata.name,
        pricebreakid: '',
        tickets: 0,
        total: '',
        reference: 'JA' + Math.random().toString(36).substr(2, 9)
      };
    },
};
</script>

<style lang="scss" scoped>
  @import "~@/styles/styles.scss";
 </style>

