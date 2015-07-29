// to depend on a bower installed component:
// define(['component/componentName/file'])

define(["jquery", "knockout"], function($, ko) {
    function Place(name, position) {
        // TODO: automatically search position
        return GOOGLEMAPS.createMarker(name, position);
    }

    function viewModel() {
        var self = this;

        var placesArray = [];

        self.listOfPlaces = ko.observableArray();

        self.addPlace = function(name, position) {
            var place = new Place(name, position);
            self.listOfPlaces.push(place);
        };

        self.removePlace = function() {
            this.setMap(null);
            self.listOfPlaces.remove(this);
        };

        self.addPlace("Universal Studios Hollywood",
                      new google.maps.LatLng(34.138117,-118.353378));
        self.addPlace("Disneyland Park",
                      new google.maps.LatLng(33.812092,-117.918974));
        self.addPlace("Hollywood Walk of Fame",
                      new google.maps.LatLng(34.0937508,-118.3264781));
        self.addPlace("Griffith Observatory",
                      new google.maps.LatLng(34.1184341,-118.3003935));

        self.toggleInfoWindow = function() {
            google.maps.event.trigger(this, 'click');
        };

        var filterSearch = function(target, keyword) {
            return target.search(new RegExp(keyword, 'i'));
        };

        self.filteredPlaces = ko.computed(function() {

        });
    }
    ko.applyBindings(new viewModel(), $('html')[0]);
});
