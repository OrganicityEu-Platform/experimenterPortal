(function() {
    'use strict';

    angular.module('app.components')
        .controller('UpdateDevController', UpdateDevController);

    UpdateDevController.$inject = ['asset'];

    function UpdateDevController(asset) {
        var vm = this;
        vm.asset = asset;
        delete(vm.asset.$$hashKey);
        vm.getFancyJson = function() {
            return JSON.stringify(vm.asset, null, 4);
        };
    }
})();
