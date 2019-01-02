<template>
  <div class="home">
    <div class="eventblock">
    <div v-for="event in events" :key="event.id">
  <div class="box">
              <p>
                <strong>{{event.name}}</strong>
                <br>
                 <small>{{event.address}}</small>
                <br>
                <small>{{event.price}}</small>
               
              </p>
            </div>
            </div>
</div>
  </div>
</template>

<script>
   import firebase from '../firebase-config';
   import {  db } from '../firebase-config';

   let myEventsRef = db.ref('events')

export default {
  name: 'home',

  data() {
      return {
        events: [],
        busy: false,
        event: {
          id: '',
          name: '',
          address: '',
          price: '',
        }
      }
    },

firebase () {
        return {
          events: myEventsRef    
        }
      },

  methods: {
   
  }
}
</script>

<style> 

 .eventblock {
  
    display: flex;           /* establish flex container */
    flex-direction: column;  /* make main axis vertical */
    justify-content: center; /* center items vertically, in this case */
    align-items: center;     /* center items horizontally, in this case */
    
    margin: 0 auto;
}

.box {
    background-color: rgb(232, 233, 233);
   
    border: 1px solid rgb(92, 91, 91);
    height: auto;
    margin: 5px;
    text-align: center;     /* will center text in <p>, which is not a flex item */
    width: 50vh;
    padding: 10px;
}

</style>