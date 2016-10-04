(function() {
  'use strict';

  angular.module('app.components')
    .directive('noDataBackdrop', noDataBackdrop);

    /**
     * Backdrop for chart section when entity has no data
     * 
     */
    noDataBackdrop.$inject = [];
    function noDataBackdrop() {
      return {
        restrict: 'A',
        scope: {},
        templateUrl: 'app/core/animation/backdrop/noDataBackdrop.html',
        controller: function($scope) {
          var vm = this;  

          vm.entityWithoutData = false;

          $scope.$on('entityWithoutData', function(ev, data) {
            vm.entityWithoutData = true;

            if(data.belongsToUser) {
              vm.user = 'owner';
            } else {
              vm.user = 'visitor';
            }
          });
        },
        controllerAs: 'vm'
      };
    }
})();
