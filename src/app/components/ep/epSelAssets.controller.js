(function() {
    'use strict';

    angular.module('app.components')
        .controller('EpSelAssetsController', EpSelAssetsController);


    EpSelAssetsController.$inject = ['$log', 'EpAssets', 'alert'];

    function EpSelAssetsController($log, EpAssets, alert) {
        var vm = this;
        vm.assets = [];
    }
})();
