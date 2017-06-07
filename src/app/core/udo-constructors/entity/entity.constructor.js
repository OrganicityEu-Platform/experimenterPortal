(function() {
  'use strict';

  angular.module('app.components')
    .factory('Entity', ['Sensor', 'entityUtils', function(Sensor, entityUtils) {
      /**
       * entity constructor.
       * @constructor
       * @param {Object} object - Object with all the data about the entity from the API
       * @property {number} id - ID of the entity
       * @property {string} name - Name of the entity
       * @property {string} type - Type of entity. Ex: SmartCitizen entity
       * @property {string} location - Location of entity. Ex: Madrid, Spain; Germany; Paris, France
       * @property {string} avatar - URL that contains the user avatar
       * @property {Array} labels - System tags
       * @property {string} state - State of the entity. Ex: Never published
       * @property {Array} userTags - User tags. Ex: ''
       */

      function Entity(object) {
        this.id = object.id;
        this.name = entityUtils.parseName(object);
        this.uuid = object.id;
        this.type = entityUtils.parseType(object);
        this.location = entityUtils.parseLocation(object);
        this.avatar = entityUtils.parseAvatar(object, this.type);
        this.labels = entityUtils.parseLabels(object); //TODO: refactor name to systemTags
        this.state = entityUtils.parseState(object);
        /*jshint camelcase: false */
        //this.userTags = object.user_tags; //tmp
      }
      return Entity;
    }]);
})();
