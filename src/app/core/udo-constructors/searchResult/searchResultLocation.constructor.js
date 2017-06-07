(function() {
  'use strict';

  angular.module('app.components')
    .factory('SearchResultLocation', ['SearchResult', function(SearchResult) {

      /**
       * Search Result Location constructor
       * @extends SearchResult
       * @param {Object} object - Object that contains the search result data from API
       * @property {number} lat - Latitude
       * @property {number} lng - Longitude
       */
      function SearchResultLocation(object) {
        SearchResult.call(this, object);

        if(object.position) {
          if(object.position.latitude && object.position.longitude && object.position.latitude !== 0 && object.position.longitude !== 0) {
              this.lat = object.position.latitude;
              this.lng = object.position.longitude;
          } else if (object.position.city){ //tmp. for unlocated data

            provider.city = object.position.city;
            this.lat = object.position.city.attributes.latitude;
            this.lng = object.position.city.attributes.longitude;
          }
        }
        else {
          if(object.data.location.latitude && object.data.location.longitude && object.data.location.latitude !== 0 && object.data.location.longitude !== 0) {
              this.lat = object.data.location.latitude;
              this.lng = object.data.location.longitude;
          } else if (object.provider.location.city){ //tmp. for unlocated data

              var providerFixture = [
                {
                  city: "Santander",
                  lat: 43.4647222,
                  lng: -3.8044444
                },
                {
                  city: "London",
                  lat: 51.5072,
                  lng: -0.1275
                },
                {
                  city: "Aarhus",
                  lat: 56.1572,
                  lng: 10.2107
                }
              ];

            var providerLocation = _.find(providerFixture, function(provider) {
              return provider.city == object.provider.location.city;
            });

            this.lat = providerLocation.lat;
            this.lng = providerLocation.lng;
          }
        }

      }

      return SearchResultLocation;
    }]);

})();
