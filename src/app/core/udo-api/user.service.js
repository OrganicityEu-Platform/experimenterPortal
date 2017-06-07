(function() {
	'use strict';

	angular.module('app.components')
	  .factory('user', user);

	  user.$inject = ['accountsAPI'];
	  function user(Restangular) {
      var service = {
        createUser: createUser,
        getUser: getUser,
        updateUser: updateUser
      };
      return service;

      ////////////////////

      function createUser(signupData) {
        return accountsAPI.all('users').post(signupData);
      }

      function getUser(id) {
        return accountsAPI.one('users', id).get();
      }

      function updateUser(updateData) {
        return accountsAPI.all('').customPUT(updateData);
      }
	  }
})();
