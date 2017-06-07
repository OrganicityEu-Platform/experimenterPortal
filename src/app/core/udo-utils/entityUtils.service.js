(function() {
  'use strict';

  angular.module('app.components')
    .factory('entityUtils', entityUtils);

    entityUtils.$inject = ['asset', 'COUNTRY_CODES'];
    function entityUtils(asset, COUNTRY_CODES) {
      var service = {
        parseName: parseName,
        parseLocation: parseLocation,
        parseLabels: parseLabels,
        parseUserTags: parseUserTags,
        parseType: parseType,
        classify: classify,
        parseTime: parseTime,
        parseVersion: parseVersion,
        parseOwner: parseOwner,
        parseState: parseState,
        parseAvatar: parseAvatar,
        belongsToUser: belongsToUser,
        parseSensorTime: parseSensorTime,
        isOnline: isOnline,
        makeCase: makeCase,
        parseStateName: parseStateName
      };

      return service;


      ///////////////
      function parseName(object) {
        if(!object.name) {
          return;
        }

        var entityName = object.name.split(":");

        entityName = entityName.slice(4, entityName.length);
        entityName = _.map(entityName, makeCase);

        object.name = entityName.join(" ");

        return object.name.length <= 41 ? object.name : object.name.slice(0, 35).concat(' ... ');
      }

      function parseLocation(object) {
        var location = '';
        var locationSource = {};

        if(object.context && object.context.position && object.context.position.city && object.context.position.country) {
            locationSource = object.context.position;
        }

        /*jshint camelcase: false */
        var city = locationSource.city;
        var country_code = locationSource.country_code;
        var country = locationSource.country;


        if(!!city) {
          location += city;
        }
        if(!!country) {
          location += ', ' + country;
        }

        if(locationSource.justOwnerLocation) location += ' (provider location)';

        return location;
      }

      function parseLabels(object) {
        var system_tags = [];

        if(!object.uuid) {
          object.uuid = object.name || "no:name"; //tmp.
        }

        system_tags.push((isOnline(object)) ? "online" : "offline");

        var entityName = object.uuid.split(":");

        var source = entityName[3];
        var origin = entityName[4];

        // if(source) system_tags.push(source);
        if(origin) system_tags.push(origin);
        /*jshint camelcase: false */
        return system_tags;
      }


      function parseUserTags(object) {
        var user_tags = ["organicity"]; //temp
        return user_tags;
      }

      function parseType(object) {
        if(object.type) {
          return object.type;
        } else {
          return 'entity';
        }
      }

      function classify(entityType) {
        if(!entityType) {
          return '';
        }
        return entityType.toLowerCase().split(' ').join('_');
      }

      function parseTime(object) {
        /*jshint camelcase: false */
        return object.data.attributes.data.TimeInstant;
      }

      function parseVersion(object) {
        if(!object.entity) {
          return;
        }
        return object.entity.name.match(/[0-9]+.?[0-9]*/)[0];
      }

      function parseOwner(object) {
        if (!object.context.provider) return;
        return {
          id: object.context.provider,
          username: object.context.provider,
          /*jshint camelcase: false */
          // entitites: object.provider.entity_ids,
          city: object.context.position.city,
          country: COUNTRY_CODES[object.context.position.country_code],
          // url: object.provider.url,
          avatar: './assets/images/avatar.svg'
        };
      }

      function parseState(object) {
        var name = parseStateName(object);
        var className = classify(name);
        return {
          name: name,
          className: className
        };
      }

      function parseStateName(object) {
        if (!object.state) {
          object.state = (object.data.attributes.length > 0) ? "has_published" : "never_published";
        }
        return object.state.replace('_', ' ');
      }

      function parseAvatar() {
        return './assets/images/avatar.svg';
      }

      function parseSensorTime(sensor) {
        /*jshint camelcase: false */
        return moment(sensor.recorded_at).format('');
      }

      function belongsToUser(entititesArray, entityID) {
        return entititesArray;
      }

      function isOnline(object) {
        var time = parseTime(object);
        var timeDifference =  (new Date() - new Date(time))/1000;
        if(!time || timeDifference > 7*24*60*60) { //a week
          return false;
        } else {
          return true;
        }
      }

      function makeCase(str) {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
      }
    }
})();
