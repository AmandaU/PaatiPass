<template>
<div> 
    <div class="footer" ref="footer" v-bind:style="{ position: footerposition }">
   
        <div class=" menuitem "  @click="navigate('About')">About
            <!-- <img src="../assets/home.png"  alt="About"  /><br> -->
        </div>
        <div class="menuitem "  @click="navigate('Contact')">Contact
            <!-- <img src="../assets/home.png"  alt="Contact"  /><br> -->
        </div>
  
    </div>
</div>  
</template>

<script>

export default {
  name: 'BottomNav',
data() {
    return {
      footerposition: 'relative' 
       }
  },

 mounted() {
    
 },

methods: {

     navigate (navPath) {
    
         let gotopath = '/' + navPath;
         this.$router.push({path: gotopath,})
     },
   
   },
}
</script>

<style> 

.footer{
   
    bottom: 0;
    left: 0;
    /* width: 100vw;
    height: 80px; */
    display:  flex;
    flex-direction:row; 
    justify-content: space-between;
   bottom:0;
   width:100%;
   height:10vh;   /* Height of the footer */
    background-color:white;
}

.menuitem{
   text-align: center;
    justify-content:center;
    align-content:center;
   display: block;
   margin: 0% auto;
   margin-top: 20px;
}
  
  .menuitem:hover {
    text-decoration:underline;
    cursor: pointer;
    }
</style>