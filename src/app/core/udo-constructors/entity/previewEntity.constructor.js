(function() {
  'use strict';

  angular.module('app.components')
    .factory('PreviewEntity', ['Entity', function(Entity) {

      /**
       * Preview entity constructor.
       * Used for entitites stacked in a list, like in User Profile or entity states
       * @extends entity
       * @constructor
       * @param {Object} object - Object with all the data about the entity from the API
       */
      function PreviewEntity(object) {
        entity.call(this, object);

        // this.dropdownOptions = [
        //   {text: 'SET UP', value: '1', href: 'entitites/edit/' + this.id + '?step=2'},
        //   {text: 'EDIT', value: '2', href: 'entitites/edit/' + this.id}
        // ];
      }
      PreviewEntity.prototype = Object.create(Entity.prototype);
      PreviewEntity.prototype.constructor = Entity;

      return PreviewEntity;

    }]);
})();
