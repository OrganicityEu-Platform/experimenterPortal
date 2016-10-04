(function() {
    'use strict';

    angular.module('app.components')
        .controller('EpNewApplicationController', EpNewApplicationController);

    EpNewApplicationController.$inject = ['EpDictionaries', '$state', '$stateParams', 'EpApplications', 'alert',
        'EpNewApp', '$mdDialog', '$rootScope'
    ];


    function EpNewApplicationController(EpDictionaries, $state, $stateParams, EpApplications, alert, 
        EpNewApp, $mdDialog, $rootScope) {
        var vm = this;
        vm.loadingChart = false;

        vm.appTypes = EpDictionaries.getAppTypes();
        console.log(JSON.stringify(vm.appTypes))
        EpNewApp.flush();

        vm.appInfo = {
            name: '',
            description: '',
            type: '',
            link: '',
            more: {}
        };

        vm.appFilename = '';

        vm.isSe = function() {
            for (var i = 0; i < vm.appTypes.length; i++) {
                if (vm.appInfo.type === 'smartphone') {
                    return true;
                }
                return false;
            }
        };

        vm.selectPlugins = function() {
            EpNewApp.setName(vm.appInfo.name);
            EpNewApp.setDescription(vm.appInfo.description);
            EpNewApp.setType(vm.appInfo.type);
            EpNewApp.setLink(vm.appInfo.link);
            EpNewApp.setMore(vm.appInfo.more);
            vm.loadingChart = true;
            $state.go('layout.ep.newApp.sePlugins', { expId: $stateParams.expId, appId: $stateParams.appId });
        };

        vm.showPluginsFailed = function() {
            $mdDialog.show({
                locals: {
                    mdInfo: {
                        proceed: function() { $mdDialog.hide(); },
                        title: 'Plugins load failed',
                        info: 'The available plugins could not be loaded. ' +
                            'Please, try again in some minutes.',
                    }
                },
                controller: 'EpErrorController as vm',
                templateUrl: 'app/components/ep/epError.html',
                clickOutsideToClose: false
            });
        };

        $rootScope.$on('sePluginsLoadFail', function() {
            vm.loadingChart = false;
            vm.showPluginsFailed();
        });

        vm.cancel = function() {
            $state.go('layout.ep.detail', { expId: $stateParams.expId });
        };

        vm.create = function() {
            vm.loadingChart = true;
            EpApplications.newApp($stateParams.expId, vm.appInfo,
                function() {
                    alert.success('Application created');
                    $state.go('layout.ep.detail', { expId: $stateParams.expId });
                },
                function() {
                    alert.error('Application creation failed');
                    $state.go('layout.ep.detail', { expId: $stateParams.expId });
                });
        };


    }
})();