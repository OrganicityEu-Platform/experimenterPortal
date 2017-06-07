(function() {
  'use strict';

  angular.module('app.components')
    .factory('searchUtils', searchUtils);


    searchUtils.$inject = [];
    function searchUtils() {
      var service = {
        parseLocation: parseLocation,
        parseName: parseName,
        parseIcon: parseIcon,
        parseIconType: parseIconType,
        parseType: parseType,
        parseTime: parseTime
      };
      return service;

      /////////////////

      function parseType(object) {  
        if (object.type) return object.type;      
        //return object.searchMatches[0]; // tmp. single Type
      }

      function parseLocation(object) {
        var location = '';

        if(!!object.city) {
          location += object.city;
        }
        if(!!object.city && !!object.country) {
          location += ', '; 
        }
        if(!!object.country) {
          location += object.country;
        }

        return location;
      }

      function parseName(object) {
        if(!object.name) {
          return;
        }

        if(object.type == "location") {
          return object.name;
        }

        var entityName = object.name.split(":");

        entityName = entityName.slice(4, entityName.length);
        entityName = _.map(entityName, makeCase);

        var name = entityName.join(" ");

        return name.length <= 41 ? name : name.slice(0, 35).concat(' ... ');
      }
      

      function parseIcon(object, type) {
        switch(type) {
          case 'name':
            return 'assets/images/entity.svg';
          case 'location':
            return 'assets/images/location_icon_normal.svg';
        }
      }

      function parseIconType(type) {
        switch(type) {
          case 'Device':
            return 'div';
          default:
            return 'img';
        }
      }

      function parseTime(object) {
        /*jshint camelcase: false */
        return object.last_reading_at;
      }


      function makeCase(str) {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
      }

    }
})();
