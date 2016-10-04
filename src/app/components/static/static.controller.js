(function() {
    'use strict';

    angular.module('app.components')
        .controller('StaticController', StaticController);

    StaticController.$inject = ['$timeout', 'animation'];

    function StaticController($timeout, animation) {
        var vm = this;

        ///////////////////////
        vm.asset = {
            name: 'uno',
            description: 'this is an experiment'
        }

        initialize();

        //////////////////

        function initialize() {
            $timeout(function() {
                animation.viewLoaded();
            }, 500);
        }
    }
})();