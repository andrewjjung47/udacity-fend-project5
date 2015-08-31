//TODO: change styling of marker when clicked.

define(['require', 'jquery', 'bootstrap', 'yelp'], function(require) {
  var $ = require('jquery');
  var yelp = require('yelp');

  var map, markers;
  var infowindow = new google.maps.InfoWindow();

  var mapReadyEvent = new Event('mapReady');

  function initialize() {
    var mapOptions = {
      center: { lat: 34.0204989, lng: -118.4117325}, // Los Angeles as initial position
      zoom: 10
    };

    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

    var cancelled = !window.dispatchEvent(mapReadyEvent);
    if (cancelled) {
      console.error("Event 'mapReady' was cancelled.");
    }
  }

  var contentTemplate = '<h4>{title}</h4>' +
    '<button class="link open-streetview">Open streets view</button>' + '<br>' +
    '<button class="link search-restaurants">Search restaurants nearby</button>';
  var contentBuilder = function(title) {
    return contentTemplate.replace('{title}', title);
  };

  function setStreetView(position) {
    var streetViewDiv = $('#street-view');
    if (streetViewDiv.length !== 0) {
      var panorama = new google.maps.StreetViewPanorama(
                                                         streetViewDiv[0],
                                                         {
                                                            position: position,
                                                            zoom: 1
                                                         });
    }
    else {
      console.error('Element #streets-view does not exist.');
    }
  }

  function openStreetView(position) {
    var modalStreetView = $('#modal-streetview');
    if (modalStreetView.length !== 0) {
      setStreetView(position);
      modalStreetView.modal();
    }
    else {
      console.error('Cannot obtain the streets view modal.');
    }
  }

  var clickedMarker;

  function createMarker(title, position) {
    var marker = new google.maps.Marker({
      position: position,
      title: title
    });
    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png')

    function markerChangeColor() {
      if (clickedMarker !== undefined) {
        clickedMarker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
      }

      marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
      clickedMarker = marker;
    }

    marker.addListener('click', function() {
        var content = contentBuilder(marker.title);
        infowindow.setContent(content);
        infowindow.open(map, marker);

        $('button.open-streetview').click(function() {
          openStreetView(position);
        });
        $('button.search-restaurants').click(function() {
          yelp.searchRestaurants(position);
        });

        markerChangeColor();
    });

    marker.setMap(map);

    return marker;
  }

  function Place(name, position) {
    // TODO: automatically search position
    return createMarker(name, position);
  }

  var filterByName = function(target, keyword) {
    console.assert(typeof target === 'string', "Parameter 'target' is not a string.");
    return (keyword !== '') && (target.search(new RegExp(keyword, 'i')) === -1) ? false: true;
  };

  var arrayFilterByName = function(array, keyword) {
    var filteredArray = [];

    array.forEach(function(element) {
      var filter = filterByName(element.title, keyword);
      if (filter) {
        filteredArray.push(element);
        element.setMap(map);
      }
      else {
        element.setMap(null);
      }
    });

    return filteredArray;
  };

  google.maps.event.addDomListener(window, 'load', initialize);

  return {
    Place: Place,
    arrayFilterByName: arrayFilterByName
  };
});
