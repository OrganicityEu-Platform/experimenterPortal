(function() {
    'use strict';

    angular.module('app.components')
        .directive('starRating', starRating);

    function starRating() {
        return {
            restrict: 'A',
            template: '<ul class="rating">' +
                ' <li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' +
                '\u2605' +
                '</li>' +
                '</ul>',
            scope: {
                ratingValue: '=ngModel',
                max: '=',
                readOnly: '=?',
                onRatingSelected: '&'
            },
            link: function(scope, elem, attrs) {
                var updateStars = function() {
                    scope.stars = [];
                    scope.set = true;
                    for (var i = 0; i < scope.max; i++) {
                        scope.stars.push({
                            filled: i < scope.ratingValue
                        });
                    }
                };

                scope.toggle = function(index) {
                    if (scope.readOnly === undefined || scope.readOnly === false) {
                        scope.ratingValue = index + 1;
                        scope.onRatingSelected({
                            rating: index + 1
                        });
                    }
                };



                scope.$watch('ratingValue',
                    function(oldVal, newVal) {
                        if (newVal) {
                            updateStars();
                        }
                    }
                );

            }
        };
    }

})();
