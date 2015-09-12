//TODO: change styling of marker when clicked.

define(['require', 'jquery', 'bootstrap', 'yelp'], function(require) {
  var $ = require('jquery'),
    yelp = require('yelp');

  var map, panorama;
  var infowindow = new google.maps.InfoWindow();

  var mapReadyEvent = new Event('mapReady');

  function initialize() {
    var center = { lat: 34.0204989, lng: -118.4117325}; // Los Angeles as initial position

    var mapOptions = {
      center: center,
      zoom: 10
    };

    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

    var streetViewDiv = $('#street-view');
    if (streetViewDiv.length !== 0) {
      panorama = new google.maps.StreetViewPanorama(
                                                         streetViewDiv[0]);
    }
    else {
      console.error('Element #street-view does not exist.');
    }

    var cancelled = !window.dispatchEvent(mapReadyEvent);
    if (cancelled) {
      console.error("Event 'mapReady' was cancelled.");
    }
  }

  function setStreetView(position) {
    // panorama.setPosition(position);
    var streetViewDiv = $('#street-view');
    panorama = new google.maps.StreetViewPanorama(
                                                       streetViewDiv[0], {
                                                        position: position
                                                       });
  }

  function openStreetView(position) {
    var modalStreetView = $('#modal-streetview');
    modalStreetView.on('shown.bs.modal', function() {
      setStreetView(position);
    });
    if (modalStreetView.length !== 0) {
      modalStreetView.modal();
    }
    else {
      console.error('Cannot obtain the streets view modal.');
    }
  }

  var contentTemplate = '<h4>{title}</h4>' +
    '<button class="link open-streetview">Open streets view</button>' + '<br>' +
    '<button class="link search-restaurants">Search restaurants nearby</button>';

  // Build infowindow content from contentTemplate
  var contentBuilder = function(title) {
    return contentTemplate.replace('{title}', title);
  };

  var clickedMarker; // tracks the mark with infowindow opened

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
          $('#modal-yelp').modal();
        });

        markerChangeColor();
    });

    marker.setMap(map);

    return marker;
  }

  function Place(name, position) {
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
