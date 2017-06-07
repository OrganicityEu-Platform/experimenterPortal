(function() {
    'use strict';

    angular.module('app.components').controller('ExperimentAppsController', ExperimentAppsController);
    ExperimentAppsController.$inject = [
        'Applications', 
        '$state', 
        'alert', 
        'AppInfo',
        'DTOptionsBuilder', 
        'DTColumnDefBuilder', 
        '$stateParams',
        '$rootScope',
        'ExpInfo', 
        '$mdDialog'
    ];

    function ExperimentAppsController(
        Applications, 
        $state, 
        alert, 
        AppInfo,
        DTOptionsBuilder, 
        DTColumnDefBuilder, 
        $stateParams,
        $rootScope,
        ExpInfo,
        $mdDialog
    ) {
        var vm = this;
        vm.loadingChart = false;
        vm.appId = "";
        vm.experimentInfo = ExpInfo.getExperiment();
        vm.apps = Applications.getApps();
       
        vm.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withDisplayLength(5)
            .withLanguage({
                "sLengthMenu": "Show _MENU_ applications",
            })
            .withOption('lengthMenu', [5, 10, 20]);

        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1).notSortable(),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3).notSortable().renderWith(deleteHtml)
        ];

        function deleteHtml(data, type, full, meta) {
            return '<i style="cursor:pointer;" class="material-icons">delete</i>';
        }

        vm.detail = function(app) {
            vm.loadingChart = true;
            $state.go('layout.appInfo', {
                expId: $stateParams.expId,
                appId: app.applicationId
            });
        };

        vm.ShortDescription = function(str) {
            return str.substr(0, 150) + '...';
        };

        vm.addApp = function() {
            vm.loadingChart = true;
            $state.go('layout.newApp', { expId: $stateParams.expId });
        };


         vm.confirmRemove = function(ev, app) {
            vm.appId = app.applicationId;
            var confirm = $mdDialog.confirm()
            .title('Do you want to remove this application?')
            .textContent('If you continue, application instances will not be allowed to access the platform')
            .ariaLabel('')
            .targetEvent(ev)
            .ok('Continue')
            .cancel('No, thanks')
            .clickOutsideToClose(true)
            .fullscreen(true);
            $mdDialog.show(confirm).then(vm.remove, function() {});
        };

        vm.remove = function() {
            vm.loadingChart = true;
            Applications.removeApp($stateParams.expId, vm.appId, RemovalSuccess, RemovalError);
        };

        function RemovalSuccess() {
            alert.success('Application has been removed');
            vm.loadingChart = false;
            vm.apps = Applications.getApps();
            vm.appId = '';
        }

        function RemovalError() {
            alert.error('Application could not be removed');
            vm.loadingChart = false;
            vm.apps = Applications.getApps();
            vm.appId = '';
        }

         vm.goHome = function (){
            $state.go('layout.exps');
        };

        vm.goExp = function (){
            $state.go('layout.detail', { expId: vm.experimentInfo.experimentId });
        };
            

    }
})();