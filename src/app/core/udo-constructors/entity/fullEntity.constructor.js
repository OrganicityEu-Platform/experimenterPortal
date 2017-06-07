(function() {
  'use strict';

  angular.module('app.components')
    .factory('FullEntity', ['Entity', 'Sensor', 'entityUtils', function(Entity, Sensor, entityUtils) {

      /**
       * Full entity constructor.
       * @constructor
       * @extends entity
       * @param {Object} object - Object with all the data about the entity from the API
       * @property {string} version - entity version. Ex: 1.0
       * @property {string} time - Last time entity sent data in UTC format
       * @property {string} timeParsed - Last time entity sent data in readable format
       * @property {string} timeAgo - Last time entity sent data in 'ago' format. Ex: 'a few seconds ago'
       * @property {string} class - CSS class for entity
       * @property {string} description - entity description
       * @property {Object} owner - entity owner data
       * @property {Array} data - entity sensor's data
       * @property {number} latitude - entity latitude
       * @property {number} longitude - entity longitude
       * @property {string} macAddress - entity mac address
       * @property {number} elevation
       */
      function FullEntity(object) {
        Entity.call(this, object);
        this.version = 'Organicity';
        this.name = entityUtils.parseName(object);
        this.time = entityUtils.parseTime(object);
        this.timeParsed = !this.time ? 'No time' : moment(this.time).format('MMMM DD, YYYY - HH:mm');
        this.timeAgo = !this.time ? 'No time' : moment(this.time).fromNow();
        this.class = entityUtils.classify(entityUtils.parseType(object));
        this.description = '';
        this.owner = entityUtils.parseOwner(object);
        this.data = object.data.attributes;
        this.latitude = object.context.position.latitude;
        this.longitude = object.context.position.longitude;
      }

      FullEntity.prototype = Object.create(Entity.prototype);
      FullEntity.prototype.constructor = FullEntity;

      FullEntity.prototype.getSensors = function() {
        var data = this.data.data;
        var sensors = _(this.data.types)
            .chain()
            .map(function(type, i) {
              return new Sensor(type, data[type], i);
            }).value();
            return sensors;
      };
      return FullEntity;
    }]);
})();
