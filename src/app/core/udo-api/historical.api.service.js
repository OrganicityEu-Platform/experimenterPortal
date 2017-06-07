(function() {
  'use strict';

  angular.module('app.components')
    .factory('historicalAPI', function(Restangular) {
      return Restangular.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl('http://dev.server.organicity.eu:12345/api/v1');
      });
    });

})();
