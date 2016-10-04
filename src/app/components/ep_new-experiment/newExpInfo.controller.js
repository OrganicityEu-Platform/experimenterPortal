(function() {
    'use strict';

    angular.module('app.components')
        .controller('EpNewExpInfoController', EpNewExpInfoController);

    EpNewExpInfoController.$inject = ['$log', 'EpNewExperiment', '$location', '$window', '$mdDialog'];

    function EpNewExpInfoController($log, EpNewExperiment, $location, $window, $mdDialog) {
        var vm = this;

        vm.browser = null;
        var userAgent = $window.navigator.userAgent;
        var browsers = {chrome: /chrome/i, safari: /safari/i, firefox: /firefox/i, ie: /internet explorer/i};
        for(var key in browsers) {
            if (browsers[key].test(userAgent)) {
                vm.browser = key;
            }
        };

        vm.assetsPublic = false;
        vm.continue = function() {
            EpNewExperiment.flush();
            EpNewExperiment.setName(vm.name);
            EpNewExperiment.setDescription(vm.description);
            EpNewExperiment.setStart(vm.startDate);
            EpNewExperiment.setEnd(vm.endDate);
            EpNewExperiment.setEnd(vm.endDate);
            EpNewExperiment.setAssetsPublic(vm.assetsPublic);
            $location.path('/new-experiment/area');
        };

        vm.cancel = function() {
            $location.path('/');
        };

        vm.infoAssets = false;

        vm.showInfoAssets = function () {
            vm.infoAssets = vm.infoAssets ? false : true;
        }

        vm.showInfo = function() {
             $mdDialog.show({
                 locals: {
                     mdInfo: {
                         proceed: function() { $mdDialog.hide(); },
                         title: 'You are creating a new experiment',
                         info: 'Fill in the form with the information of your experiment. \
                         A catchy name and engaging description will encourage people \
                         to take part on it.',
                     }
                 },
                controller: 'EpErrorController as vm',
                templateUrl: 'app/components/ep/epError.html',
                clickOutsideToClose: false
             });

         };

     }
})();
