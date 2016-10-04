(function() {
    'use strict';

    angular.module('app.components')
        .controller('EpConfirmController', EpConfirmController);

    EpConfirmController.$inject = ['mdInfo'];

    function EpConfirmController(mdInfo) {
        var vm = this;

        vm.title = mdInfo.title;
        vm.info = mdInfo.info;
        vm.question = mdInfo.question;

        vm.cancel = function() {
            mdInfo.cancel();
        };

        vm.proceed = function() {
            mdInfo.proceed();
        };

    }
})();
