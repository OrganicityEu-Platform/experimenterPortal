(function() {
    'use strict';


    angular.module('app.components').controller('StaticController', StaticController);
    StaticController.$inject = [
        '$scope',
        '$filter'
    ];

    function StaticController(
        $scope,
        $filter
    ) {
        var vm = this;    
        vm.jsonData = {
            Name: "Joe", "Last Name": "Miller", Address: {Street: "Neverland 42"}, Hobbies: ["doing stuff", "dreaming"]
        };

        $scope.$watch('vm.jsonData', function(json) {
            vm.jsonString = $filter('json')(json);
        }, true);
        $scope.$watch('vm.jsonString', function(json) {
            try {
                vm.jsonData = JSON.parse(json);
                vm.wellFormed = true;
            } catch(e) {
                vm.wellFormed = false;
            }
        }, true);
    }
})();
