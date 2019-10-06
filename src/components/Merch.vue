<template>
  <div class="centralcontainer">
    <div class="centreblock">
     
      <br>
      <cube-spin v-if="busy"></cube-spin>
      <div class="eventblock">
          <br>
           <div class="pricebreakblock">
             <div  v-for="product in products" :key="product['.key'] ">
              <div class="pricebreakrow">
            
                <div class="pricebreakcolumn1">
                  <strong>{{product.name}}, size {{product.size}} at R {{product.price}} each </strong>
                  <small>{{ total(product) }}</small>
                </div>

                <div  class="pricebreakcolumn2">
                     <div v-show="!isItemAvailable(product)" class="pricebreakdetailitem">SOLD OUT !! </div>
                
                     <div v-show="isItemAvailable(product)" class="pricebreaknumberrow" >

                        <div class="ticketselection ">
                          <div class="pricebreakdetailitem"> {{String(product.number)}}</div>
                        </div>  
                        <br>

                        <div  class="pricebreakbuttonbox">
                          <img src="../assets/plus.jpg"  alt="plus"  @click="itemSelected(product,true)" class="pricebreakimage"/>
                          <img v-show="product.number > 0" src="../assets/minus.png"  alt="minus"  @click="itemSelected(product, false)" class="pricebreakimage"/><br>
                        </div>   
                  
                    </div> 
                </div>  

                 <div class="thinline"></div>  

              </div> 
             </div> 
           </div>

            <!-- <div class="promoterblock">

                 <label for="billingaddress">Billing address:</label>
                <input id="billingaddress" v-model="address.billingaddress" placeholder="billing address" :disabled="true">
                <label for="postalcode">Postal code:</label>
                <input id="postalcode" v-model="adress.zipcode" placeholder="postal code" :disabled="true">
                <label for="shippingaddress">Shipping Address:</label>
                <input id="shippingaddress" v-model="address.shippingaddress" placeholder="shipping address" :disabled="true">
            </div> -->

          <div class="shoppingcartblock">
             <div class="checkoutblock">
              <h2>Checkout</h2>

              <div  v-for="product in products" :key="product['.key'] ">
                <div v-show="product.number > 0" class="checkoutrow ">
                
                  <div  class="checkouttickets ">
                    <small>{{product.name}}: {{String(product.number)}}</small>
                  </div>

                  <div  class="checkouttickettotal ">
                    <small>{{totalValueForProduct(product)}}</small>
                  </div> 

                </div>  
              </div>
              <br>

                <div  class="checkoutrow ">
                    <div  class="checkouttickets "/>
                    <div  class="checkouttickettotal "> 
                      <div class="thinline"></div>  
                    </div> 
                </div> 

                <div  class="checkoutrow ">
                  <div  class="checkouttickets ">
                      <small>Total: {{totalItems}}</small>
                  </div>

                  <div  class="checkouttickettotal "> 
                    <small>{{totalInvoiceValue}}</small>
                  </div>
                </div> 
              
                <br> 
                
                <div v-show="totalItems > 0" @click="buyItems()" class="eventbutton">Buy</div>
              
            </div>  
          </div> 
       </div> 
  
      <br> <br>
     
      <br>
    </div>
  </div>
  
</template>

<script>
  import CubeSpin from 'vue-loading-spinner/src/components/ScaleOut'
  import firebase from '../firebase-config';
  import {  db } from '../firebase-config';
  
export default {
  name: 'merch',
  components: {
      CubeSpin
  },
 
  data: function () {
    return {
      shoppingcartItems: [],
      products: [],
      product:{
        name: "",
        size: "",
        price: 0,
        number: 0,
        imageurl: ""
      },
    //   addresses:[],
    //   address:{
    //     userid: "",
    //     zipcode: "",
    //     billingaddress: "",
    //     shippingaddress: "",
    //   },
      busy: false,
      products: [],
      shoppingcart: {},
      greaterThan800: window.innerWidth > 800
      }
  },

  firebase () {
     var currentUser = firebase.auth().currentUser;
    return {
      products: db.ref('products')
     }
    },

    created() {

        // this.$firebaseRefs.products.push({
        //                 name: "RudeBoyz Hoodie",
        //                 size: "M",
        //                 price: 100.00,
        //                 number: 1
        // });
        // this.$firebaseRefs.products.push({
        //                 name: "RudeBoyz Hoodie",
        //                 size: "S",
        //                 price: 100.00,
        //                 number: 5
        // })
        // if(localStorage.getItem(this.$props.ticketref))
        // {
        //     this.shoppingcart = JSON.parse(localStorage.getItem(this.$props.ticketref));
        // }
        // let img = this.shoppingcart? this.shoppingcart.product.imageurl:'';
        // this.$eventHub.$emit('eventimageurl', img);
    },
 
  methods: 
  { 
  
  itemSelected: function( product, add) {
   if(product.number == 0 && !add)return;
  
    if(add){
        if (product.number == 0)   this.shoppingcartItems.push(product)
        product.number = product.number + 1
    } else {
        product.number = product.number - 1
        if (product.number == 0) this.shoppingcartItems = arrayRemove(this.shoppingcartItems, product)
      }
  },

  setProduct()
  {
      //this.$eventHub.$emit('eventimageurl', this.event.imageurl);
      var currentUser = firebase.auth().currentUser;
      
      this.shoppingcart = {
        email: currentUser? currentUser.email: "",
        name: "",
        userid: currentUser? currentUser.uid: "",
        products: this.shoppingcartItems,
        address:{},
        reference: 'JA' + Math.random().toString(36).substr(2, 9),
        promocode: "",
        promotionvalue: 0,
        totalPaid: 0,
        zapperPaymentMethod: false,
        zapperPaymentId: 0,
        zapperReference: ""
      };
        this.busy = false;
  },

  arrayRemove(arr, value) {

   return arr.filter(function(ele){
       return ele != value;
   });

},

    buyItems: function() {
        const currentUser = firebase.auth().currentUser;
        // this.$firebaseRefs.addresses.push({
        //     userid: currentUser.uid,
        //     billingaddress: address.billingaddress,
        //     shippingaddress: address.shippingaddress,
        //     zipcode: address.zapperReference,
        // });
        setProduct()
        localStorage.setItem(this.shoppingcart.reference, JSON.stringify(this.shoppingcart));
        if (!currentUser)
        {
            this.$router.replace({ name: 'Login', params: {ticketref: this.shoppingcart.reference}});
        } 
        else
        {
            this.$router.replace({ name: 'Checkout', query: {ticketref: this.shoppingcart.reference}});
        }
    },

    media800Enter(mediaQueryString) {
        this.greaterThan800 = false
    },
  
    media800Leave(mediaQueryString) {
        this.greaterThan800 = true
    },
       
    total: function(product) {
    //   if(this.isTicketsAvailable(pricebreak))
    //   {
     
            if( product.number == 0) return  "";
            let total = product.number * Number(product.price);
            return 'You will purchase  ' +  String(product.number) + ' at R' + String(product.price) + ' each. The total is ' + String('R ' + total + '.00');
        //}
    },

    isItemAvailable: function(product){
        return true;
    },

    totalValueForProduct: function(product){
        var value = Number(product.number * product.price);
        return value == 0? "R 0.00": String('R ' + value + '.00');
    },

},

computed: {

    isMobile: function()
    {
        return navigator.userAgent.match(/Android/i) ||
            navigator.userAgent.match(/webOS/i) ||
            navigator.userAgent.match(/iPhone/i) ||
            navigator.userAgent.match(/iPad/i) ||
            navigator.userAgent.match(/iPod/i) ||
            navigator.userAgent.match(/BlackBerry/i) ||
            navigator.userAgent.match(/Windows Phone/i) ;
    },

    totalItems: function()
    {
        var total = 0;
        this.products.forEach(element => {
            total += element.number;
        });
        return total ; 
    },

    totalInvoiceValue: function()
    {
        var value = 0;
        this.products.forEach(element => {
        
            value += Number(element.number * element.price);
        
        });
        return value == 0? "R 0.00": String('R ' + value + '.00');
    },
 }
 
};
</script>

<style lang="scss" scoped>
  @import "~@/styles/styles.scss";
 </style>