(function() {
    'use strict';

    angular.module('app.components').controller('ExperimentInfoController', ExperimentInfoController);

    ExperimentInfoController.$inject = [
        'alert',
        '$state',
        '$timeout',
        'leafletData',
        'ExpInfo',
        'auth',
        '$window',
        'mapUtils',
        'LoadedElements',
        '$rootScope'
    ];

    function ExperimentInfoController(
        alert,
        $state,
        $timeout,
        leafletData,
        ExpInfo,
        auth,
        $window,
        mapUtils,
        LoadedElements,
        $rootScope
    ) {
        var vm = this;


        vm.experimentInfo = ExpInfo.getNewExperiment();
        vm.clientInfo = vm.experimentInfo.clientInfo || {};
        vm.redirectUrisModified = false;
        vm.redirectUris = [];
        vm.mainExperimenterId = ExpInfo.getMainExperimenter();
        vm.currentExperimenterId = auth.getCurrentUserid();
        vm.loadingChart = false;

        vm.currentInfo = {
            experimentId: vm.experimentInfo.experimentId,
            name: vm.experimentInfo.name,
            description: vm.experimentInfo.description,
            assetsPublic: vm.experimentInfo.assetsPublic
        };

        vm.UpdateExperiment = function() {
            ExpInfo.setNewName(vm.currentInfo.name);
            ExpInfo.setNewDescription(vm.currentInfo.description);
            ExpInfo.setNewDescription(vm.currentInfo.description);
            ExpInfo.setNewAssetsPublic(vm.currentInfo.assetsPublic);
            vm.loadingChart = true;
            ExpInfo.update(successUpdate, errorUpdate);
        };

        function successUpdate() {
            alert.success('Experiment successfully updated');
            vm.loadingChart = false;
            $state.go($state.current, { onEdit: false }, { reload: true });
        }

        function errorUpdate() {
            alert.success('Experiment could not be updated');
            vm.loadingChart = false;
            $state.go($state.current, { onEdit: false }, { reload: true });
        }

        vm.reset = function() {
            ExpInfo.reset();
            $state.go($state.current, { onEdit: false }, { reload: true });
        };

        vm.gotoArea = function () {
            ExpInfo.reset();
            vm.loadingChart = true;
            $state.go('layout.expEdition.area', { expId: vm.experimentInfo.experimentId });  
        };

        vm.gotoTags = function() {
            ExpInfo.reset();
            vm.loadingChart = true;
            $state.go('layout.expEdition.tags', { expId: vm.experimentInfo.experimentId });
        };

        vm.gotoCredentials = function() {
            ExpInfo.reset();
            vm.loadingChart = true;
            $state.go('layout.expEdition.credentials', { expId: vm.experimentInfo.experimentId });
        };

        vm.gotoTeam = function() {
            ExpInfo.reset();
            vm.loadingChart = true;
            $state.go('layout.expEdition.team', { expId: vm.experimentInfo.experimentId });
        };

        vm.gotoAssets = function() {
            ExpInfo.reset();
            vm.loadingChart = true;
            $state.go('layout.expEdition.assets', { expId: vm.experimentInfo.experimentId });
        };

        vm.gotoApps = function() {
            ExpInfo.reset();
            vm.loadingChart = true;
            $state.go('layout.expEdition.apps', { expId: vm.experimentInfo.experimentId });
        };


        vm.gotoParticipants = function() {
            ExpInfo.reset();
            vm.loadingChart = true;
            $state.go('layout.expEdition.participants', { expId: vm.experimentInfo.experimentId });
        };

        vm.goHome = function (){
            $state.go('layout.exps');
        };

        vm.infoAssets = false;

        vm.showInfoAssets = function () {
            vm.infoAssets = vm.infoAssets ? false : true;
        };

         vm.callHref = function (ref) {
            $window.open(ref, '_blank');
        };
    }
})();
