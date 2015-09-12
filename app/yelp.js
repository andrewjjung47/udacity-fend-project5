define(['require', 'jquery', 'knockout'], function() {
  var $ = require('jquery'),
    ko = require('knockout');

  var auth = {
    consumerKey: 'UXE8YtH8w-QpMfiuFgE3vg',
    consumerSecret: '2vgE0fCMD-rgRtfv3mjyeYkygvU',
    accessToken: 'GQpJ7ta9-8pID38FnZHDjNE0nNp23T1y',
    accessTokenSecret: 'Omo46E71JHRxGfirGkiJhhK_uQ4',
    serviceProvider: {
      signatureMethod: "HMAC-SHA1"
    }
  };

  var accessor = {
    consumerSecret: auth.consumerSecret,
    tokenSecret: auth.accessTokenSecret
  };

  var baseUrl = 'http://api.yelp.com/v2/search';

  var terms = 'restaurants';

  var location = 'Los Angeles';

  var baseParameters = [];
  baseParameters.push(['term', terms]);
  baseParameters.push(['callback', 'cb']);
  baseParameters.push(['oauth_consumer_key', auth.consumerKey]);
  baseParameters.push(['oauth_consumer_secret', auth.consumerSecret]);
  baseParameters.push(['oauth_token', auth.accessToken]);
  baseParameters.push(['oauth_signature_method', 'HMAC-SHA1']);
  baseParameters.push(['location', location]);

  var searchParameters = function(position) {
    var lat = position.lat();
    var lng = position.lng();

    var cll = lat + ',' + lng;

    var parameters = baseParameters.slice(0);
    parameters.push(['cll', cll]);

    return parameters;
  };

  var requestData = function(position) {
    var parameters = searchParameters(position);

    var message = {
      'action': baseUrl,
      'method': 'GET',
      'parameters': parameters
    };

    return message;
  };

  var processReturnData = function(data) {
    var restaurants = [];

    data.businesses.forEach(function(restaurantData) {
      restaurants.push({
        name: restaurantData['name'],
        url: restaurantData['url'],
        image: restaurantData['image_url'],
        rating_img: restaurantData['rating_img_url'],
        categories: restaurantData['categories'].map(function(category) {
          return category[0]
        })
      });
    });

    return restaurants;
  };

  var searchRestaurants = function(position) {
    var message = requestData(position);

    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);
    var parameterMap = OAuth.getParameterMap(message.parameters);
    parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature);

    $.ajax({
      'url': message.action,
      'data': parameterMap,
      'cache': true,
      'dataType': 'jsonp',
      'jsonpCallback': 'cb',
      'success': function(data, textStats, XMLHttpRequest) {
        var restaurants = processReturnData(data);
        yelpModelObject.newRestaurants(restaurants.slice(0, 5));
      }
    });
  };

  function yelpModel() {
    var self = this;

    self.restaurants = ko.observableArray();

    self.newRestaurants = function(restaurants) {
      self.restaurants.removeAll();

      restaurants.forEach(function(restaurant) {
        self.restaurants.push(restaurant);
      });

      console.log(self.restaurants.slice(0));
    };

    self.CommaSeparateCategories = function(categories) {
      return categories.join(', ');
    };
  }

  var yelpModelObject;

  window.addEventListener('mapReady', function() {
    yelpModelObject = new yelpModel();
    ko.applyBindings(yelpModelObject, $('#modal-yelp')[0]);
  });

  return {
    searchRestaurants: searchRestaurants
  };
});