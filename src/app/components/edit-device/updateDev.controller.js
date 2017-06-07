(function() {
    'use strict';


    angular.module('app.components').controller('UpdateDeviceController', UpdateDeviceController);
    UpdateDeviceController.$inject = [
        'ExpInfo', 
        '$state', 
        'Devices', 
        'alert', 
        'auth',
        '$mdDialog',
        '$scope',
        '$filter',
        'selectedAsset'
    ];

    function UpdateDeviceController(
        ExpInfo, 
        $state, 
        Devices, 
        alert, 
        auth, 
        $mdDialog,
        $scope,
        $filter,
        selectedAsset
    ) {
        var vm = $scope;


        vm.loadingChart = false;
        vm.areAttributes = false;
        vm.forbiddenChars = ['<','>', "'", '=', ';', '(', ')', ' '];

        vm.experimentInfo = ExpInfo.getExperiment();
        vm.mainExperimenter = ExpInfo.getMainExperimenter();
        vm.experId = auth.getCurrentUser().data.id;
        vm.expId = ExpInfo.getExperiment().experimentId;
        vm.assetTypePrefix = 'urn:oc:entityType:';
        vm.assetIdPrefix = 'urn:oc:entity:experimenters:' + vm.mainExperimenter + ':' + vm.expId + ':';
        vm.asset = selectedAsset;
        vm.isTypeRight = true;
        vm.isIdRight = true;
        vm.hasAttributes = false;
        $scope.assetString = '{"id": "hola"}';

        $scope.$watch('asset', function(json) {
            vm.assetString = $filter('json')(json);
            vm.hasRightId();
            vm.hasRightType();
            vm.hasAttributesF();
        }, true);
        $scope.$watch('assetString', function(json) {
            vm.hasRightId();
            vm.hasRightType();
            vm.hasAttributesF();
            try {
                vm.asset = JSON.parse(json);
                vm.wellFormed = true;
            } catch(e) {
                vm.wellFormed = false;
            }
        }, true);


        vm.hasRightType = function () {
            try{
                if (vm.asset.type.substring(0, vm.assetTypePrefix.length) == vm.assetTypePrefix) {
                    vm.isTypeRight = true;
                    return ;
                }
            } catch(e) {}
            vm.isTypeRight = false;
        };

        vm.hasRightId = function () {
            try {
               if (vm.asset.id.substring(0, vm.assetIdPrefix.length) == vm.assetIdPrefix) {
                    vm.isIdRight = true;
                    return;
                }
            } catch(e) {}
            vm.isIdRight = false;
        };

        vm.hasAttributesF = function () {
            vm.hasAttributes = false;
            for (var property in vm.asset) {
                if (property !== 'type' && property !== 'id') {
                    vm.hasAttributes = true;
                    return;
                }
            }
        };


        vm.update = function() {
            vm.loadingChart = true;
            Devices.updateDevice(vm.expId, vm.asset, function() {
                    vm.loadingChart = false;
                    $mdDialog.hide();
                    alert.success('Update succeeded');
                },
                function(info) {
                    vm.loadingChart = false;
                    alert.error('Update failed: ' + info.data.message);
                });
        };

        vm.cancel = function () {
            $mdDialog.hide();
        };

    }
})();