(function() {
    'use strict';

    angular.module('app.components')
        .controller('EpErrorController', EpErrorController);

    EpErrorController.$inject = ['mdInfo'];

    function EpErrorController(mdInfo) {
        var vm = this;

        vm.title = mdInfo.title;
        vm.info = mdInfo.info;

        vm.proceed = function() {
            mdInfo.proceed();
        };

    }
})();
