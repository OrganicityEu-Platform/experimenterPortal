(function() {
  'use strict';

  angular.module('app.components')
    .factory('HasSensorEntity', ['Entity', function(Entity) {

      function HasSensorEntity(object) {
        // entity.call(this, object);        
        // this.data = object.data.attributes;
        // this.longitude = object.data.location.longitude;
        // this.latitude = object.data.location.latitude;
      }

      // HasSensorEntity.prototype = Object.create(entity.prototype);
      // HasSensorEntity.prototype.constructor = entity;
      //
      // HasSensorEntity.prototype.sensorsHasData = function() {
      //   var parsedSensors = this.data.map(function(sensor) {
      //     return sensor.value;
      //   });
      //
      //   return _.some(parsedSensors, function(sensorValue) {
      //     return !!sensorValue;
      //   });
      // };

      return HasSensorEntity;
    }]);
})();
