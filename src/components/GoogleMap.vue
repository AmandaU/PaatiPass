<template>
  <div >
    <a  @click="reCentremap()" style="float: right;text-decoration:underline;
    cursor: pointer">
        <span >Re-centre map on event</span> 
    </a>
    <br>
     <div  :style="getMapStyle()" id="Googlemap" ref="map">
    <!-- <div class="google-map" id="Googlemap" ref="map"> -->
       <media :query="{maxWidth: 800}" @media-enter="media800Enter" @media-leave="media800Leave"> </Media> 
    </div>
  </div>
</template>

<script>
import $Scriptjs from 'scriptjs';
import Media from 'vue-media'
import {googleMapApi} from '../config';

export default {
  name: 'GoogleMap',
  components: {
     Media
    },
  props: [
      'name',
      'addressCoordinate',
      'venueaddress'
      ],

  data: function () {
    return {
      map: null,
      bounds: null,
      markers: [],
      mapOptions:{},
      greaterThan800: window.innerWidth > 800,
      }
  },

  computed :{

 
},

mounted: function () {
     let key = 'https://maps.googleapis.com/maps/api/js?key=' + googleMapApi.key;
    
    //1
    //   $Scriptjs(key, () => {
    //       this.initMap()
    // });
  
      //2
       let self = this;
       this.$loadScript(key)
        .then(() => {
          self.initMap();
        });
 },

methods:
{
    initMap: function(){

      var latlong = new google.maps.LatLng(this.addressCoordinate.latitude, this.addressCoordinate.longitude)
        this.mapOptions = {
            center: latlong,
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.ROADMAP//'roadmap'
            
        }
        this.map = new google.maps.Map(document.getElementById("Googlemap"), this.mapOptions);
        const position = latlong;
        const marker = new google.maps.Marker({ 
            position,
            map: this.map
       });

      // google.maps.event.addDomListener(window, "load", function () {

        var infowindow = new google.maps.InfoWindow();
          let self = this;
          google.maps.event.addListener(marker, 'mouseover', (function(marker) {
              return function() {
                  infowindow.setContent("Click for directions to: " + self.venueaddress);
                  infowindow.open(self.map, marker);
              }
              })(marker));

          google.maps.event.addListener(marker, 'click', (function(marker) {
              return function() {
                  infowindow.setContent(self.venueaddress);
                  infowindow.open(self.map, marker);
                  var addressEncoded = encodeURI(self.venueaddress);
                  window.location.href = 'http://maps.google.com/?ll=' + self.addressCoordinate.latitude + ',' + self.addressCoordinate.longitude +
                  '&destination=' + addressEncoded;
                  ;
              }
              })(marker));
      // });
           
           window.onresize = function() {
          
            const mapdiv = document.getElementById('Googlemap');
             mapdiv.style.height = self.getMapHeight();
            mapdiv.style.width = self.getMapWidth();
            mapdiv.style.paddingTop = self.getMapPadding();
            mapdiv.style.backgroundColor = '#CCCBCB';
            
            self.$nextTick(function() {
               var currCenter = self.map.getCenter();
              google.maps.event.trigger(self.map, 'resize');
              self.map.setCenter(currCenter);
             })
          };
       },

    reCentremap() {
      this.map.setCenter(new google.maps.LatLng(this.addressCoordinate.latitude, this.addressCoordinate.longitude));
    },

     media800Enter(mediaQueryString) {
      this.greaterThan800 = false;
    },

    media800Leave(mediaQueryString) {
      this.greaterThan800 = true;
    },

    getMapWidth: function () { 
       var padding = this.greaterThan800?  150: 20 ;
      return  String(window.innerWidth - (padding * 2)) + 'px';
      
    },

    getMapHeight: function () { 
        var padding = this.greaterThan800?  100: 20 ;
      return  String((window.innerWidth - (padding * 2)) * 0.6) + 'px';
      
    },

     getMapPadding: function () { 
       var padding = this.greaterThan800?  50: 5 ;
      return  String(padding) + 'px';
      
    },

     getMapStyle: function () { 
         return  {
         'width': this.getMapWidth(),
          'height': this.getMapHeight(),
          'padding-top': this.getMapPadding(),
          'background': '#CCCBCB'
        }
    },
    
 }

};
</script>

<style scoped>
.google-map {
 width: 100%;
  height:100%;
 
}

/* 
@media all and (max-width: 800px) {
  .google-map {
  width: 450;
  height:450;

    margin-left: 50px;
   margin-right: 50px;
  }
}

@media all and (max-width: 600px) {
  .google-map {
  width: 200px;
  height:200px;
 
    margin-left: 10px;
   margin-right: 10px;
  } 
}*/
</style>