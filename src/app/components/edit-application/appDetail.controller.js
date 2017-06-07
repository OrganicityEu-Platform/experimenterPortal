(function() {
    'use strict';

    angular.module('app.components').controller('AppDetailController', AppDetailController);

    AppDetailController.$inject = [
        '$state', 
        'AppInfo', 
        'alert', 
        '$stateParams',
        '$rootScope', 
        'ExpInfo'
    ];

    function AppDetailController(
        $state, 
        AppInfo, 
        alert, 
        $stateParams, 
        $rootScope, 
        ExpInfo
    ) {
        var vm = this;

        vm.appInfo = AppInfo.getNewApp();
        vm.experimentInfo = ExpInfo.getExperiment();
        vm.experimenterId = ExpInfo.getMainExperimenter();
        vm.plugins = [];

        vm.changed = false;

        vm.currentInfo = {
            name: vm.appInfo.name,
            description: vm.appInfo.description,
            link: vm.appInfo.link,
            type: vm.appInfo.type,
            more: vm.appInfo.more || {}
        };

        vm.resultsLink = 'https://set.organicity.eu/experiment/certain/' + vm.appInfo.applicationId;
        vm.codeuploadLink = 'https://set.organicity.eu/experiment/updateJar/' + vm.appInfo.applicationId;
        vm.sensorjarUpload = 'https://set.organicity.eu/plugin/addPlugin';
        vm.pluginsSelection = 'https://set.organicity.eu/plugin/userPlugins';

        vm.isSe = function() {
            return (vm.currentInfo.type === 'smartphone');
        };


        init();

        function init() {
            if (!vm.isSe() ) {
                return;
            }

            try {
            var strArray = vm.appInfo.more.sensorDependencies.split(',');
                for (var i = 0; i < strArray.length; i++) {
                    var aux = strArray[i].split('.');
                    vm.plugins.push(aux.pop());
                }
            }
            catch (e) {}
        }

        vm.update = function() {
            AppInfo.setNewName(vm.currentInfo.name);
            AppInfo.setNewDescription(vm.currentInfo.description);
            AppInfo.setNewLink(vm.currentInfo.link);
            AppInfo.setNewType(vm.currentInfo.type);
            AppInfo.update(successUpdate, errorUpdate);
            vm.changed = true;
        };

        function successUpdate() {
            vm.changed = false;
            alert.success('Application successfully updated');
            vm.goApps();
        }

        function errorUpdate() {
            vm.changed = false;
            alert.error('Application could not be updated. Try it later');
            vm.goApps();
        }


        vm.reset = function() {
            AppInfo.reset();
            $state.go($state.current, {}, { reload: true });
        };


        vm.updatePlugins = function() {
            vm.loadingChart = true;
            $state.go('layout.appEdition.sePlugins', { expId: $stateParams.expId, appId: $stateParams.appId });
        };

        vm.pluginsModified = function() {
            return AppInfo.pluginsModified();
        };

        $rootScope.$on('sePluginsLoadFail', function() {
            vm.loadingChart = false;
            alert.error('Plugins could not be loaded');
        });

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
    }
})();