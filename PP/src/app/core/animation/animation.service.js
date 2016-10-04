(function() {
  'use strict';

  angular.module('app.components')
    .factory('animation', animation);

    /**
     * Used to emit events from rootscope.
     *
     * This events are then listened by $scope on controllers and directives that care about that particular event
     */

    animation.$inject = ['$rootScope', 'auth'];
    function animation($rootScope) {

    	var service = {
        blur: blur,
        unblur: unblur,
        removeNav: removeNav,
        addNav: addNav,
        showChartSpinner: showChartSpinner,
        hideChartSpinner: hideChartSpinner,
        entityLoaded: entityLoaded,
        showPasswordRecovery: showPasswordRecovery,
        showLogin: showLogin,
        showSignup: showSignup,
        showPasswordReset: showPasswordReset,
        hideAlert: hideAlert,
        viewLoading: viewLoading,
        viewLoaded: viewLoaded,
        entityWithoutData: entityWithoutData,
        goToLocation: goToLocation,
        mapStateLoading: mapStateLoading,
        mapStateLoaded: mapStateLoaded
    	};
    	return service;

      //////////////

    	function blur() {
        $rootScope.$broadcast('blur');
    	}
    	function unblur() {
    	  $rootScope.$broadcast('unblur');
    	}
      function removeNav() {
        $rootScope.$broadcast('removeNav');
      }
      function addNav() {
        $rootScope.$broadcast('addNav');
      }
      function showChartSpinner() {
        $rootScope.$broadcast('showChartSpinner');
      }
      function hideChartSpinner() {
        $rootScope.$broadcast('hideChartSpinner');
      }
      function entityLoaded(data) {
        $rootScope.$broadcast('entityLoaded', data);
      }
      function showPasswordRecovery() {
        $rootScope.$broadcast('showPasswordRecovery');
      }
      function showLogin() {
        $rootScope.$broadcast('showLogin');
      }
      function showSignup() {
        $rootScope.$broadcast('showSignup');
      }
      function showPasswordReset() {
        $rootScope.$broadcast('showPasswordReset');
      }
      function hideAlert() {
        $rootScope.$broadcast('hideAlert');
      }
      function viewLoading() {
        $rootScope.$broadcast('viewLoading');
      }
      function viewLoaded() {
        $rootScope.$broadcast('viewLoaded');
      }
      function entityWithoutData(data) {
        $rootScope.$broadcast('entityWithoutData', data);
      }
      function goToLocation(data) {
        $rootScope.$broadcast('goToLocation', data);
      }
      function mapStateLoading() {
        $rootScope.$broadcast('mapStateLoading');
      }
      function mapStateLoaded() {
        $rootScope.$broadcast('mapStateLoaded');
      }
    }
})();
