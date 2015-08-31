define(['require', 'jquery'], function() {
  var $ = require('jquery');

  var oauth = OAuth({
      consumer: {
          public: 'UXE8YtH8w-QpMfiuFgE3vg',
          secret: '2vgE0fCMD-rgRtfv3mjyeYkygvU'
      },
      signature_method: 'HMAC-SHA1'
  });

  var token = {
      public: 'pINulqxz9N9xBVIQAVED95r-TJG83piE',
      secret: 'QtwPNDurMjpApL-gVQ60LXanPQA'
  };

  var baseUrl = 'http://api.yelp.com/v2/search';

  var searchData = function(position) {
    var lat = position.lat();
    var lng = position.lng();
    return {
      term: 'restaurants',
      cll: lat + ',' + lng,
      location: 'Los Angeles'
    };
  };

  var requestData = function(position) {
    var data = searchData(position);
    return {
      url: baseUrl,
      method: 'POST',
      data: data
    };
  };

  var searchRestaurants = function(position) {
    var cb = function(data) {
      console.log(data);
    };

    var request = requestData(position);
    request.data['callback'] = 'cb';
    console.log(request);
    var oauthParam = oauth.authorize(request, token);

    console.log(oauthParam);


    $.ajax({
      url: request.url,
      type: request.method,
      data: oauthParam,
      dataType: 'jsonp'
    });
  };

  return {
    searchRestaurants: searchRestaurants
  };
});