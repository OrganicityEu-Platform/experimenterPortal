(function() {
    'use strict';


    angular.module('app.components').controller('ExpAssetsController', ExpAssetsController);
    ExpAssetsController.$inject = [
        'Devices', 
        '$state', 
        'ExpInfo',
        'DTOptionsBuilder', 
        'DTColumnDefBuilder',
        '$mdDialog'
    ];

    function ExpAssetsController(
        Devices, 
        $state, 
        ExpInfo,
        DTOptionsBuilder,  
        DTColumnDefBuilder,
        $mdDialog
    ) {
        var vm = this;
        vm.loadingChart = false;
        vm.editionEnabled = true;
        vm.showErrorLoad = false;
        vm.assets = [];
        vm.regions =  ExpInfo.getExperiment().area || [];
        vm.experimentInfo = ExpInfo.getExperiment();

        vm.assets = Devices.getDevices();    

        vm.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withDisplayLength(10)
            .withLanguage({
                "sLengthMenu": "Show _MENU_ assets",
            })
            .withOption('lengthMenu', [10, 20, 50]);

        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
        ];

        vm.addDev = function() {
            vm.loadingChart = true;
            $state.go('layout.newAsset', { expId: vm.experimentInfo.experimentId});
        };

        vm.assetClick = function(ev, asset) {
            var custom = {
                locals:{selectedAsset: asset},    
                controller: 'UpdateDeviceController',
                templateUrl: 'app/components/edit-device/updateDev.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: false
            };
            $mdDialog.show(custom, function(){}, function(){});
        };

         vm.goHome = function (){
            $state.go('layout.exps');
        };

        vm.goExp = function (){
            $state.go('layout.detail', { expId: vm.experimentInfo.experimentId });
        };

    }
})();