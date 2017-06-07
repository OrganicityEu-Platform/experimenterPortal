(function() {
    'use strict';


    angular.module('app.components').controller('NewDeviceController', NewDeviceController);
    NewDeviceController.$inject = [
        'ExpInfo', 
        '$state', 
        'Devices', 
        'alert', 
        'auth',
        '$window', 
        '$mdDialog',
        '$scope',
        '$filter'
    ];

    function NewDeviceController(
        ExpInfo, 
        $state, 
        Devices, 
        alert, 
        auth, 
        $window, 
        $mdDialog,
        $scope,
        $filter
    ) {
        var vm = this;


        vm.loadingChart = false;
        vm.areAttributes = false;
        vm.forbiddenChars = ['<','>', "'", '=', ';', '(', ')', ' '];

        vm.experimentInfo = ExpInfo.getExperiment();
        vm.mainExperimenter = ExpInfo.getMainExperimenter();
        vm.experId = auth.getCurrentUser().data.id;
        vm.expId = ExpInfo.getExperiment().experimentId;
        vm.assetTypePrefix = 'urn:oc:entityType:';
        vm.assetIdPrefix = 'urn:oc:entity:experimenters:' + vm.mainExperimenter + ':' + vm.expId + ':';

        vm.asset = {
            type: vm.assetTypePrefix,              
            id: vm.assetIdPrefix
        };

        vm.isTypeRight = true;
        vm.isIdRight = true;
        vm.hasAttributes = false;

        $scope.$watch('vm.asset', function(json) {
            vm.assetString = $filter('json')(json);
            vm.hasRightId();
            vm.hasRightType();
            vm.hasAttributesF();
        }, true);
        $scope.$watch('vm.assetString', function(json) {
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


        vm.hasForbiddenChars = function () {
            for (var i = 0; i < vm.forbiddenChars.length; ++i) {
                if (vm.assetString.indexOf(vm.forbiddenChars[i]) !== -1) {
                    return true;
                }
            }
        };


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
                console.log("Chcking prperty ", property);
                if (property !== 'type' && property !== 'id') {
                    vm.hasAttributes = true;
                    return;
                }
            }
        };

        function hasType (prop) {
            return prop.hasOwnProperty('type');
        }

        function hasVal (prop) {
            return prop.hasOwnProperty('value');
        }

        function hasMetadata (prop) {
            return prop.hasOwnProperty('metadata');
        }

        function hasOthersTypeId (prop) {
            for (var property in prop) {
                if (property !== 'type' && property !== 'id') {
                    return true;
                }
            }
            return false;
        }

        function hasOthersTypeIdMet (prop) {
            for (var property in vm.asset) {
                if (property !== 'type' && property !== 'id' && property !== 'metadata') {
                    return true;
                }
            }
            return false;
        }

        vm.create = function() {
            vm.loadingChart = true;
            Devices.newDevice(vm.expId, vm.asset, function() {
                    vm.loadingChart = false;
                    alert.success('Asset creation succeeded');
                    $state.go('layout.expEdition.assets', { expId: vm.expId });
                },
                function(info) {
                    vm.loadingChart = false;
                    alert.error('Asset creation failed: ' + info.data.message);
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

        vm.goAssets = function() {
            vm.loadingChart = true;
            $state.go('layout.expEdition.assets', { expId: vm.experimentInfo.experimentId });
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