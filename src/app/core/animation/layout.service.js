(function() {
  'use strict';

  angular.module('app.components')
    .factory('layout', layout);


    function layout() {

      var entityHeight;

      var service = {
        setentity: setentity,
        getentity: getentity
      };
      return service;

      function setentity(height) {
        entityHeight = height;
      }

      function getentity() {
        return entityHeight;
      }
    }
})();
