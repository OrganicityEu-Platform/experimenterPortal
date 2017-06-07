(function() {
  'use strict';

  angular.module('app.components')
    .directive('disableScroll', disableScroll);

    disableScroll.$inject = ['$timeout'];
    function disableScroll($timeout) {
      return {
        // link: {
          // pre: link
        // },
        compile: link,
        restrict: 'A',
        priority: 100000
      };


      //////////////////////

      function link(elem) {
        // var select = elem.find('md-select'); 
        // angular.element(select).on('click', function() {
        elem.on('click', function() {
          angular.element(document.body).css('overflow', 'hidden');
          $timeout(function() {
            angular.element(document.body).css('overflow', 'initial'); 
          });
        });
      }
    }
})();
