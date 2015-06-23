// to depend on a bower installed component:
// define(['component/componentName/file'])

define(["jquery", "knockout"], function($, ko) {
  function Place(name, position) {
    // TODO: automatically search position
    return GOOGLEMAPS.createMarker(name, position);
  }

  function viewModel() {
    var self = this;

    self.listOfPlaces = ko.observableArray();

    self.addPlace = function(name, position) {
      var place = new Place(name, position);
      self.listOfPlaces.push(place);
    };

    self.addPlace("Universal Studios Hollywood",
                  new google.maps.LatLng(34.138117,-118.353378));
    self.addPlace("Disneyland Park",
                  new google.maps.LatLng(33.812092,-117.918974));

    //GOOGLEMAPS.createMarker(self.listOfPlaces()[0]);
  }
  ko.applyBindings(new viewModel(), $('html')[0]);
});
