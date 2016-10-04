(function() {
    'use strict';

    angular.module('app.components')
        .controller('EpExperimentAppsController', EpExperimentAppsController);

    EpExperimentAppsController.$inject = ['EpApplications', '$state', 'alert', '$mdDialog', 'AppInfo',
        'DTOptionsBuilder', 'DTColumnDefBuilder', '$stateParams', 'loadApps', '$rootScope'
    ];

    function EpExperimentAppsController(EpApplications, $state, alert, $mdDialog, AppInfo,
        DTOptionsBuilder, DTColumnDefBuilder, $stateParams, loadApps, $rootScope) {
        var vm = this;
        vm.loadingChart = false;
        vm.editionEnabled = true;
        vm.showErrorLoad = false;
        vm.appId = "";

        vm.apps = EpApplications.getApps();


        vm.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withLanguage({
                "sLengthMenu": "Show _MENU_ applications",
            })
            .withOption('lengthMenu', [2, 5, 10, 50]);

        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1).notSortable(),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3).notSortable(),
            DTColumnDefBuilder.newColumnDef(4).notSortable().renderWith(deleteHtml)
        ];


        function deleteHtml(data, type, full, meta) {
            return '<i style="cursor:pointer;" class="material-icons">delete</i>';
        }

        vm.detail = function(app) {
            vm.loadingChart = true;
            $state.go('layout.ep.appInfo', {
                expId: $stateParams.expId,
                appId: app.applicationId
            });
        };

        vm.ShortDescription = function(str) {
            return str.substr(0, 150) + '...';
        };

        vm.addApp = function() {
            $state.go('layout.ep.newApp', { expId: $stateParams.expId });
        };

        vm.confirmRemove = function(ev, app) {
            vm.appId = app.applicationId;
            $mdDialog.show({
                locals: {
                    mdInfo: {
                        cancel: function() { $mdDialog.hide(); },
                        proceed: vm.remove,
                        title: 'You are removing an application',
                        info: 'By doing so, application instances will not be' +
                            'allowed to access the platform',
                        question: 'Do you want to continue?'
                    }
                },
                controller: 'EpConfirmController as vm',
                templateUrl: 'app/components/ep/epConfirm.html',
                clickOutsideToClose: false
            });
        };

        vm.remove = function() {
            $mdDialog.hide();
            vm.loadingChart = true;
            EpApplications.removeApp($stateParams.expId, vm.appId, RemovalSuccess, RemovalError);
        };

        function RemovalSuccess() {
            alert.success('Application has been removed');
            vm.loadingChart = false;
            vm.apps = EpApplications.getApps();
            vm.appId = '';
        }

        function RemovalError() {
            alert.error('Applications removal was not correctly performed');
            vm.loadingChart = false;
            vm.apps = EpApplications.getApps();
            vm.appId = '';
        }

        vm.showInfoDictsFailed = function() {
            $mdDialog.show({
                locals: {
                    mdInfo: {
                        proceed: function() { $mdDialog.hide(); },
                        title: 'Application creation failed',
                        info: 'Application template could not be loaded.' +
                            'Please, try again in some minutes.',
                    }
                },
                controller: 'EpErrorController as vm',
                templateUrl: 'app/components/ep/epError.html',
                clickOutsideToClose: false
            });
        };


        $rootScope.$on('appTypesFail', function() {
            vm.loadingChart = false;
            vm.editionEnabled = false;
            vm.showInfoDictsFailed();
        });

        if (loadApps.success === false) {
            vm.editionEnabled = false;
            vm.showErrorLoad = true;
        }
    }
})();