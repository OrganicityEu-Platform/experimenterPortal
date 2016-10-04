(function() {
    'use strict';

    angular.module('app.components')
        .controller('EpNewDeviceController', EpNewDeviceController);

    EpNewDeviceController.$inject = ['EpDictionaries', 'EpExpInfo', '$state', 'EpDevices', 'alert', 'auth','$window', '$mdDialog'];


    function EpNewDeviceController(EpDictionaries, EpExpInfo, $state, EpDevices, alert, auth, $window, $mdDialog) {
        var vm = this;
        vm.assetTypes = EpDictionaries.getAssetTypes();
        vm.unitTypes = EpDictionaries.getUnitTypes();
        vm.attributeTypes = EpDictionaries.getAttributeTypes();
        vm.dataTypes = EpDictionaries.getDataTypes();
        vm.loadingChart = false;
        vm.areAttributes = false;
       
        vm.options = {
            //expanded: true,
            theme: 'barebones'
        };

        //
        // Edit state:
        // onAsset
        // onAttribute
        // onMeta
        //
        vm.editState = 'onAsset';

        vm.name = '';
        vm.type = '';
        vm.mainExperimenter = EpExpInfo.getMainExperimenter();
        vm.experId = auth.getCurrentUser().data.id;
        vm.expId = EpExpInfo.getExperiment().experimentId;
        vm.assetTypePrefix = 'urn:oc:entitytype:';
        vm.assetIdPrefix = 'urn:oc:entity:experimenters:' + vm.mainExperimenter + ':' + vm.expId + ':';

        vm.headers = {
            'Authorization': 'Bearer ...',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Organicity-Application': 1234,
            'X-Organicity-Experiment': vm.expId
        }

        vm.asset = {
            type: vm.assetTypePrefix,
            id: vm.assetIdPrefix,
            //attributes: []
        };


        vm.newAttribute = {};
        vm.newMeta = null;



        vm.editId = function() {
            try {
                if (vm.name.length) {
                    vm.asset.id = vm.assetIdPrefix + vm.name;
                }
            } catch (e) {
                vm.asset.id = vm.assetIdPrefix;
            }

        };

        vm.editType = function() {
            try {
                if (vm.type.substring(0, vm.assetTypePrefix.length) !== vm.assetTypePrefix) {
                    vm.asset.type = vm.assetTypePrefix + vm.type;
                } else {
                    vm.asset.type = vm.type;
                }
            } catch (e) {
                vm.asset.type = vm.assetTypePrefix;
            }
        };

        vm.assetTypeSel = function(seleceted) {
            vm.asset.type = selected.name;
        };

        vm.addAttr = function() {
            vm.editState = 'onAttribute';
            vm.clearNewAttribute();
        };

        vm.attrCancel = function() {
            vm.editState = 'onAsset';
            vm.attrOpt = 'legacy';
        };

        vm.attrDone = function() {

            console.log(vm.newAttribute);
            //vm.asset.attributes.push(vm.newAttribute);
            vm.asset[vm.newAttribute.name] = {
                type: vm.newAttribute.type,
                value: vm.newAttribute.value,
                metadatas: vm.newAttribute.metadatas
            };
            vm.areAttributes = true;
            vm.editState = 'onAsset';
            vm.attrOpt = 'legacy';
        };

        vm.addMeta = function() {
            vm.editState = 'onMeta';
            vm.clearNewMeta();
        };

        vm.metaCancel = function() {
            vm.editState = 'onAttribute';
        };

        vm.metaDone = function() {
            vm.editState = 'onAttribute';
            vm.newAttribute.metadatas.push(vm.newMeta);
        };

        vm.cancel = function() {
            $state.go('layout.ep.detail', { expId: vm.expId });
        };

        vm.canCreate = function () {
            if (vm.name === '' || vm.type === '' || !vm.areAttributes) {
                return false;
            }
            return true;
        }

        vm.finish = function() {
            vm.loadingChart = true;
            EpDevices.newDevice(vm.expId, vm.asset, function() {
                    alert.error('Asset creation succeeded');
                    $state.go('layout.ep.detail', { expId: vm.expId });
                },
                function() {
                    alert.error('Asset creation failed');
                    $state.go('layout.ep.detail', { expId: vm.expId });
                });
        };

        vm.radioClick = function() {
            vm.clearNewAttribute();
        };

        vm.clearNewAttribute = function() {
            vm.newAttribute = {};

        };

        vm.clearNewMeta = function() {
            vm.newMeta = {
                'name': '',
                'type': '',
                'value': ''
            };
        };

        vm.attrSel = function(selected) {
            vm.newAttribute.type = selected.name;
            vm.newAttribute.metadatas = [];
            for (var i = 0; i < selected.units.length; i++) {
                vm.newAttribute.metadatas.push({
                    'name': 'unit',
                    'type': selected.units[i].urn,
                    'value': selected.units[i].name
                });
                if (i === selected.units.length - 1) {
                    vm.newAttribute.metadatas.push({
                        'name': 'dataType',
                        'type': selected.units[i].datatype.urn,
                        'value': selected.units[i].datatype.name,
                    });
                }
            }
        };

        vm.metaSel = function(selected) {
            vm.newMeta.type = selected.urn;
            vm.newMeta.value = selected.name;
        };

        vm.showInfo = function() {
             $mdDialog.show({
                 locals: {
                     mdInfo: {
                         proceed: function() { $mdDialog.hide(); },
                         title: 'You are creating an asset',
                         info: 'You can define the attributes and metadata of your asset. \
                         Be aware that the asset requires a name, type and at least one attribute.',
                     }
                 },
                controller: 'EpErrorController as vm',
                templateUrl: 'app/components/ep/epError.html',
                clickOutsideToClose: false
             });

         };

    }
})();