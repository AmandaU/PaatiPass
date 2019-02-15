<template>
<div> 
    <div class="footer" ref="footer" v-bind:style="{ position: footerposition }">
   
        <div class=" menuitem "  @click="navigate('About')">
            <img src="../assets/home.png"  alt=""  /><br>
        </div>
        <div class="menuitem "  @click="navigate('Contact')">
            <img src="../assets/home.png"  alt=""  /><br>
        </div>
  
    </div>
</div>  
</template>

<script>

import { EventBus } from '../eventbus.js';

export default {
  name: 'BottomNav',
data() {
    return {
      footerposition: 'relative' 
       }
  },

//  created() {
//   EventBus.$on('footerpositionchange', (position)=> this.getFooterPosition(position));
//  },

methods: {

     getFooterPosition: function (position) { 
        debugger;

        this.footerposition = position;
        return;
           var windowHeight = window.innerHeight;
                // this.$nextTick(function() 
                // {
            debugger;
                
            // var footer = this.$refs.footer;
            // let  originalFooterBottom = footer.offsetTop + footer.clientHeight;
                    
            this.footerposition =  windowHeight > height? 'relative': 'absolute' ;
                
                        // return  {
                        // 'bottom':'0',
                        // 'left': '0',
                        // 'width': '100%',
                        // 'height': '60px',
                        // 'position': position,
                        // 'justify-content': 'space-between',
                        // 'flex-direction':'row', 
                        // 'display':  'flex'
                        // }
                       
               // });
      },

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
   background:#6cf;
}

.menuitem{
   
    justify-content:center;
    align-content:center;
   display: block;
    margin: 0 auto;
margin-top: 10px;
}
  
  .menuitem:hover {
    text-decoration:underline;
    cursor: pointer;
    }
</style>