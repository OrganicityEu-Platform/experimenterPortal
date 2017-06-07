(function() {
    'use strict';

    angular.module('app.components')
        .directive('tagList', tagList);

    function tagList() {
        return {
            restrict: 'E',
            template: '<ul>' +
                '<li class="ep-tag" ng-repeat="tag in validTags">' +
                '<label ng-bind="tag">' +
                '</label></li>' +
                '</ul>',
            scope: {
                max: '=',
                tagList: '=ngModel',
            },
            controller: function($scope, $element, $attrs) {
                var max;
                var list = [];

                if ($scope.tagList instanceof Function) {
                    list = $scope.tagList();
                } else {
                    list = $scope.tagList;
                }
                if ($scope.max === undefined || $scope.max > list.length) {
                    max = list.length;
                } else {
                    max = $scope.max;
                }

                var isInKey = function(elem, key, array) {
                    for (var i = 0; i < array.length; i++) {
                        if (array[i] === elem[key]) {
                            return true;
                        }
                    }
                    return false;
                };

                var isIn = function(elem, array) {
                    for (var i = 0; i < array.length; i++) {
                        if (array[i] === elem) {
                            return true;
                        }
                    }
                    return false;
                };

                $scope.validTags = [];
                for (var i = 0; i < max; i++) {
                    var aux = list[i];
                    if ($attrs.key !== undefined) {
                        if (!isInKey(aux, $attrs.key, $scope.validTags)) {
                            $scope.validTags.push(aux[$attrs.key]);
                        }
                    } else if (!isIn(aux, $scope.validTags)) {
                        $scope.validTags.push(aux);
                    }
                }
            }
        };
    }
})();
