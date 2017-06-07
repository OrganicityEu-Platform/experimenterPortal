(function() {
  'use strict';

  angular.module('app.components')
    .factory('search', search);

    search.$inject = ['$http', 'assetsAPI'];
    function search($http, assetsAPI) {
      var service = {
        globalSearch: globalSearch
      };

      return service;

      /////////////////////////

      function globalSearch(query) {
    	  return assetsAPI.all('metadata/search').getList({query: query.toLowerCase()});
      }
    }
})();
