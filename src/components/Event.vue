<template>
  <div class="hello">
   <h1>{{ eventdata.name }}</h1>
   <h2>{{ eventdata.address }}</h2>
    <div  v-for="pricebreak in pricebreaks" :key="pricebreak['.key']">
      <div  class="box">
             
                <strong>{{pricebreak.name}}</strong>
                <strong> R {{pricebreak.price}}</strong>
                <br>
               
               <select v-model="pricebreak.userreserved"
                  @change="ticketsSelected( pricebreak)" >
                  <option value="">Select number of tickets</option>
                  <option v-for="ticket in ticketselection" v-bind:key="ticket.name" v-bind:value="ticket.name"  >
                    {{ ticket.name }}
                  </option>
               </select>
                <br>
                
                 <button @click="BuyTickets" >Buy</button>
           
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
import Vue from 'vue';
  import firebase from '../firebase-config';
  import {  db } from '../firebase-config';

  let myUsersRef = db.ref('users')
  let myEventsRef = db.ref('events')
  let myPriceBreaksRef = db.ref('pricebreaks')//.orderByChild("eventid").equalTo(eventdata.eventid)

  let idparam = '';
  let title = '';
  let event = '';

export default {
  name: 'Event',
  props: {
       eventdata: {
        type: Object,
        required: true // User can accept a userData object on params, or not. It's totally optional.
      }
  },

  firebase () {
    let  eventidd = String(this.$props.eventdata.id) 
    return {
    
       events: myEventsRef,//myEventsRef, // loopable with v-for
       eventsObj: { // can use keys, but v-for doesn't loop
        source: myEventsRef,
        asObject: true
        },
       pricebreaks:  db.ref('pricebreaks').orderByChild("eventid").equalTo(eventidd),
       pricebreaksObj: { // can use keys, but v-for doesn't loop
        source: myPriceBreaksRef,
        asObject: true
        },
       }
      },

  data : function ()  {
    return {
      ticketselection: [
        {name: '1'},
        {name: '2'},
        {name: '3'},
        {name: '4'},
         {name: '5'},
          {name: '6'},
           {name: '7'},
            {name: '8'},
             {name: '9'},
              {name: '10'},
      ],
     numberOfTicketsSelected: '',
      events: [],
     
      pricebreaks: [],
      pricebreak: {},
     
      ticket: {
        userid: '',
        eventid: '',
        pricebreakid: '',
        tickets: ''
      },
      title : '',
      address: '',
      price: '',
      greaterThan800: window.innerWidth > 800
      }
  },

  methods: 
{ 
  ticketsSelected: function(pricebreak) {
    var context = this;
    Vue.nextTick(function () {
      debugger;
         context.ticket.tickets = pricebreak.userreserved;
        context.ticket.userid = context.firebase.auth().currentUser.userid;
        context.ticket.eventid = context.eventdata.id;
        context.ticket.pricebreakid = pricebreak.id
    })
 
    },

    BuyTickets: function() {
        
        this.busy = true;
        this.$firebaseRefs.tickets.push({
                      tickets: this.ticket.tickets,
                      eventid: this.ticket.eventid,
                      userid: this.ticket.userid,
                      pricebreakid: this.ticket.pricebreakid
        })
        this.busy = false;
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
        // this.$firebaseRefs.events.push({
        //     name: this.event.name,
        //     address: this.event.address
        // })
 debugger;
        this.$firebaseRefs.pricebreaks.push({
                      order: '0',
                      eventid: '1',
                      price: '100',
                      number: '120',
                      reserved: '0',
                      sold: '0'
        })

        // this.event.name = '';
        // this.event.address = '';
        //this.$router.push('/index')
      },

      getPriceBreak: function(eventid)
      {
      debugger;
      for (let i = 0; i < this.pricebreaks.length; i++)
      {
       let priceb = this.pricebreaks[i];
       if (priceb.eventid == eventid) {
                this.pricebreak =  { 
                      order: priceb.order,
                      eventid: priceb.eventid,
                      number: priceb.number,
                      reserved: priceb.reserved,
                      sold: priceb.sold
                      };
              }
         }
     }
   },

   computed: {
      
    total : function(e) {
      if(tick.tickets == 0)
      {
        return '';
      }
      return 'You will purchase  '//{{ ticket.tickets }} at R{{pricebreak.price}} each. Total is R
    }
},

created() {
//this.addItem();
    
  },

};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.select {
  display: grid;
  width: 100px;
}

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
