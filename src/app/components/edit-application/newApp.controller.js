(function() {
    'use strict';

    angular.module('app.components')
        .controller('NewApplicationController', NewApplicationController);

    NewApplicationController.$inject = [
        '$state', 
        '$stateParams', 
        'Applications', 
        'alert',
        'NewApp', 
        '$mdDialog', 
        '$rootScope',
        'ExpInfo'
    ];


    function NewApplicationController(
        $state, 
        $stateParams, 
        Applications, 
        alert, 
        NewApp, 
        $mdDialog, 
        $rootScope,
        ExpInfo
    ) {
        var vm = this;
        vm.loadingChart = false;
        vm.experimentInfo = ExpInfo.getExperiment();

        NewApp.flush();

        vm.appInfo = {
            name: '',
            description: '',
            type: '',
            link: '',
            more: {}
        };

        vm.appFilename = '';

        vm.isSe = false;

        vm.setSe = function() {
            if (!vm.isSe) {
                vm.appInfo.type = 'smartphone';    
                vm.isSe = true;
                return;
            }
            vm.appInfo.type = '';    
            vm.isSe = false;
        };

        vm.selectPlugins = function() {
            NewApp.setName(vm.appInfo.name);
            NewApp.setDescription(vm.appInfo.description);
            NewApp.setType(vm.appInfo.type);
            NewApp.setLink(vm.appInfo.link);
            NewApp.setMore(vm.appInfo.more);
            vm.loadingChart = true;
            $state.go('layout.newApp.sePlugins', { expId: $stateParams.expId, appId: $stateParams.appId });
        };

        $rootScope.$on('sePluginsLoadFail', function() {
            vm.loadingChart = false;
            alert.error('Plugins could not be loaded');
        });

        vm.create = function() {
            vm.loadingChart = true;
            Applications.newApp($stateParams.expId, vm.appInfo,
                function() {
                    alert.success('Application created');
                    vm.goApps();
                },
                function() {
                    alert.error('Application creation failed');
                    vm.goApps();
                });
        };

        vm.goHome = function (){
            vm.loadingChart = true;
            $state.go('layout.exps');
        };

        vm.goExp = function (){
            vm.loadingChart = true;
            $state.go('layout.detail', { expId: vm.experimentInfo.experimentId });
        };

        vm.goApps = function() {
            vm.loadingChart = true;
            $state.go('layout.expEdition.apps', { expId: vm.experimentInfo.experimentId });
        };

         vm.infoMain = false;

        vm.showInfoMain = function () {
            vm.infoMain = vm.infoMain ? false : true;
        };

        vm.callHref = function (ref) {
            $window.open(ref, '_blank');
        };


    }
})();