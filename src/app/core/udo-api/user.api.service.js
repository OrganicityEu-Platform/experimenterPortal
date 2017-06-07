(function() {
  'use strict';

  angular.module('app.components')
    .factory('accountsAPI', function(Restangular) {
      return Restangular.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl('https://accounts.organicity.eu/realms/organicity/protocol/openid-connect/auth/'); // This is just an example
      });
    });

})();
