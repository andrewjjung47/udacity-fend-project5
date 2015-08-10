define(['require'], function(require) {
  var map, markers;
  var infowindow = new google.maps.InfoWindow();

  function initialize() {
    var mapOptions = {
      center: { lat: 34.0204989, lng: -118.4117325}, // Los Angeles as initial position
      zoom: 10
    };

    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
  }
  google.maps.event.addDomListener(window, 'load', initialize);

  function createMarker(title, position) {
    var marker = new google.maps.Marker({
      position: position,
      title: title
    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(this.title);
        infowindow.open(map, this);
    });

    marker.setMap(map);

    return marker;
  }

  return {
    createMarker: createMarker
  };
});
