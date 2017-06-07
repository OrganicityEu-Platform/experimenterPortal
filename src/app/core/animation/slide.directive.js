(function() {
  'use strict';

  /**
   * Unused directive. Double-check before removing.
   * 
   */
  angular.module('app.components')
    .directive('slide', slide)
    .directive('slideMenu', slideMenu);

    function slideMenu() {
      return {
        controller: controller,
        link: link
      };

      function link(scope, element) {
        scope.element = element;
      }

      function controller($scope) {
        $scope.slidePosition = 0;
        $scope.slideSize = 20;

        getTimesSlided = function() {
          return $scope.slideSize;
        };
        getPosition = function() {
          return $scope.slidePosition * $scope.slideSize;
        };
        decrementPosition = function() {
          $scope.slidePosition -= 1;
        };
        incrementPosition = function() {
          $scope.slidePosition += 1;
        };
        scrollIsValid = function(direction) {
          var scrollPosition = $scope.element.scrollLeft();
          if(direction === 'left') {
            return scrollPosition > 0 && $scope.slidePosition >= 0;
          } else if(direction === 'right') {
            return scrollPosition < 300;
          }
        };
      }
    }

    slide.$inject = [];
    function slide() {
      return {
        link: link, 
        require: '^slide-menu',
        restrict: 'A',
        scope: {
          direction: '@'
        }
      };

      function link(scope, element, attr, slideMenuCtrl) {
        //select first sensor container
        var sensorsContainer = angular.element('.sensors_container');

        element.on('click', function() {

          if(slideMenuCtrl.scrollIsValid('left') && attr.direction === 'left') {
            slideMenuCtrl.decrementPosition();                       
            sensorsContainer.scrollLeft(slideMenuCtrl.getPosition());
          } else if(slideMenuCtrl.scrollIsValid('right') && attr.direction === 'right') {
            slideMenuCtrl.incrementPosition(); 
            sensorsContainer.scrollLeft(slideMenuCtrl.getPosition()); 
          }          
        });
      }
    }
})();
