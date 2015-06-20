var map, markers, infoWindow;

function initialize() {
  var mapOptions = {
    center: { lat: 34.0204989, lng: -118.4117325},
    zoom: 8
  };
  var map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
}
google.maps.event.addDomListener(window, 'load', initialize);