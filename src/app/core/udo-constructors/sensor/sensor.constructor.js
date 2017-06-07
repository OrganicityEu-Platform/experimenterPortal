(function() {
  'use strict';

  angular.module('app.components')
    .factory('Sensor', ['sensorUtils', function(sensorUtils) {

      /**
       * Sensor constructor
       * @param {Object} sensorData - Contains the data of a sensor sent from the API
       * @param {Array} sensorTypes - Contains generic data about types of sensors, such as id, name, description,..
       * @property {string} name - Name of sensor
       * @property {number} id - ID of sensor
       * @property {string} unit - Unit of sensor. Ex: %
       * @property {string} value - Last value sent. Ex: 95
       * @property {string} prevValue - Previous value before last value
       * @property {string} icon - Icon URL for sensor
       * @property {string} arrow - Icon URL for sensor trend(up, down or equal)
       * @property {string} color - Color that belongs to sensor
       * @property {string} fullDescription - Full Description for popup
       * @property {string} previewDescription - Short Description for dashboard. Max 140 chars
       */
      function Sensor(sensor, sensorData, collectionID) {
        this.name = sensorUtils.getSensorName(sensor);
        this.id = sensorData.type;
        this.unit = sensorUtils.getSensorUnit(sensor, sensorData);
        this.value = sensorUtils.getSensorValue(sensorData);
        this.prevValue = sensorUtils.getSensorPrevValue(sensorData);
        this.icon = sensorUtils.getSensorIcon(sensorData.type);
        this.arrow = sensorUtils.getSensorArrow(this.value, this.prevValue);
        this.color = sensorUtils.getSensorColor(sensorData, collectionID);
        this.uuid = sensorData.type.replace(/:/g, '_');

        var description = sensor; //sensorUtils.getSensorDescription(this.id, sensorTypes);
        description = (description) ? description : "Description not available";
        this.fullDescription = description;
        this.previewDescription = description.length > 140 ? description.slice(0, 140).concat(' ... ') : description;
      }
      return Sensor;
    }]);
})();
