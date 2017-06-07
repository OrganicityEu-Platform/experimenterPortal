(function() {
  'use strict';

  angular.module('app.components')
    .factory('utils', utils);

    utils.$inject = ['asset', 'PreviewEntity', '$q'];
    function utils(asset, PreviewEntity, $q) {
      var service = {
        parseEntity: parseEntity,
        parseEntityTime: parseEntityTime,
        parseSensorTime: parseSensorTime,
        convertTime: convertTime,
        getOwnerentitites: getOwnerentitites
      };


      return service;

      ///////////////////////////

      function parseEntity(object) {
        var parsedEntity = {
          entityName: object.entity.name,
          entityType: parseEntityType(object),
          entityLastTime: moment(parseEntityTime(object)).fromNow(),
          entityLocation: parseEntityLocation(object),
          entityLabels: parseEntityLabels(object),
          entityClass: classify(parseEntityType(object))
        };
        return parsedEntity;
      }

      function parseEntityLocation(object) {
        var location = '';

        var city = object.data.location.city;
        var country = object.data.location.country;

        if(!!city) {
          location += city;
        }
        if(!!country) {
          location += ', ' + country;
        }

        return location;
      }

      function parseEntityLabels(object) {
        return {
          status: object.status,
          exposure: object.data.location.exposure
        };
      }

      function parseEntityType(object) {
        var entityType;

        entityType = 'Unknown entity';

        return entityType;
      }

      function classify(entityType) {
        if(!entityType) {
          return '';
        }
        return entityType.toLowerCase().split(' ').join('_');
      }

      function parseEntityTime(object) {
        /*jshint camelcase: false */
        return object.updated_at;
      }

      function parseSensorTime(sensor) {
        /*jshint camelcase: false */
        return moment(sensor.recorded_at).format('');
      }

      function convertTime(time, withSeconds) {
        var t = new Date(time);
        if(withSeconds) {
          return moment(t.toISOString()).format('YYYY-MM-DDThh:mm:ss') + 'Z';
        } else {
          return moment(t.toISOString()).format('YYYY-MM-DDThh:mm') + 'Z';
        }
      }

      function getOwnerentitites(ids) {
        var deferred = $q.defer();
        var entititesResolved = 0;
        var entitites = [];

        ids.forEach(function(id, index) {
          asset.getAsset(id)
            .then(function(data) {
              entitites[index] = new PreviewEntity(data);
              entititesResolved++;

              if(ids.length === entititesResolved) {
                deferred.resolve(entitites);
              }
            });
        });
        return deferred.promise;
      }
    }
})();
