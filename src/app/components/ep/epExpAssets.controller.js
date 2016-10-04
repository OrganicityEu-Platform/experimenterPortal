(function() {
    'use strict';

    angular.module('app.components')
        .controller('EpExpAssetsController', EpExpAssetsController);

    EpExpAssetsController.$inject = ['EpDevices', '$state', '$mdDialog', 'EpExpInfo',
        '$rootScope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'loadDevices'
    ];

    function EpExpAssetsController(EpDevices, $state, $mdDialog, EpExpInfo,
        $rootScope, DTOptionsBuilder, DTColumnDefBuilder, loadDevices) {
        var vm = this;
        vm.loadingChart = false;
        vm.editionEnabled = true;
        vm.showErrorLoad = false;
        vm.assets = EpDevices.getDevices();

        for (var i = 0; i < vm.assets.length; i++) {
            console.log(vm.assets[i])
            console.log("============")
        }

        vm.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withLanguage({
                "sLengthMenu": "Show _MENU_ assets",
            })
            .withOption('lengthMenu', [10, 20, 50]);

        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3).notSortable()
        ];

        vm.addDev = function() {
            vm.loadingChart = true;
            $state.go('layout.ep.newAsset', { expId: EpExpInfo.getMainExperimenter()});
        };

        vm.assetClick = function(asset) {
            console.log(asset)
            $mdDialog.show({
                locals: { asset: asset },
                controller: 'UpdateDevController as vm',
                templateUrl: 'app/components/ep_newDev/updateDev.html',
                clickOutsideToClose: true
            });
        };

        vm.showInfoDictsFailed = function() {
            $mdDialog.show({
                locals: {
                    mdInfo: {
                        proceed: function() { $mdDialog.hide(); },
                        title: 'Asset creation failed',
                        info: 'Assets templates could not be loaded, so that the asset creation ' +
                            'functionality has been disable. Please, try again in some minutes.',
                    }
                },
                controller: 'EpErrorController as vm',
                templateUrl: 'app/components/ep/epError.html',
                clickOutsideToClose: false
            });
        };

        $rootScope.$on('assetDictsFail', function() {
            vm.loadingChart = false;
            //vm.editionEnabled = false;
            vm.showInfoDictsFailed();
        });

        if (loadDevices.success === false) {
            //vm.editionEnabled = false;
            //vm.showErrorLoad = true;

        }
    }
})();