<template>
  <div class="google-map" id="Googlemap" ref="map">
   </div>
</template>

<script>
import $Scriptjs from 'scriptjs';
import {googleMapApi} from '../config';

export default {
  name: 'GoogleMap',
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
      mapOptions:{}
    }
  },

mounted: function () {
     let key = 'https://maps.googleapis.com/maps/api/js?key=' + googleMapApi.key;
      $Scriptjs(key, () => {
      this.initMap()
    });

  },

methods:
{
   
    initMap: function(){
        this.mapOptions = {
            center: new google.maps.LatLng(this.addressCoordinate.latitude, this.addressCoordinate.longitude),
            zoom: 10,
            mapTypeId: 'roadmap'
            
        }
        this.map = new google.maps.Map(document.getElementById("Googlemap"), this.mapOptions);
        const position = new google.maps.LatLng(this.addressCoordinate.latitude, this.addressCoordinate.longitude);
        const marker = new google.maps.Marker({ 
            position,
            map: this.map
       });

       var infowindow = new google.maps.InfoWindow();
        let self = this;
       google.maps.event.addListener(marker, 'mouseover', (function(marker) {
            return function() {
                infowindow.setContent(self.venueaddress);
                infowindow.open(self.map, marker);
            }
            })(marker));

        google.maps.event.addListener(marker, 'click', (function(marker) {
            return function() {
                infowindow.setContent(self.venueaddress);
                infowindow.open(self.map, marker);
                window.location.href = 'http://maps.google.com/?ll=' + self.addressCoordinate.latitude + ',' + self.addressCoordinate.longitude;
            }
            })(marker));

    }
   
}

};
</script>

<style scoped>
.google-map {
   
  width:800px;
  height:600px;

  /* height: calc(width * 1.3); */
  margin: 0 auto;
  background: rgb(204, 203, 203);
}

@media all and (max-width: 800px) {
  .google-map {
    width:600px;
    height:450px;
  }
}

@media all and (max-width: 600px) {
  .google-map {
    width:450px;
    height:337px;
  }
}
</style>