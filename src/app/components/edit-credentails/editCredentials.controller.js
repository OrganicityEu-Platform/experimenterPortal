(function() {
    'use strict';


    angular.module('app.components').controller('EditCredentialsController', EditCredentialsController);
    EditCredentialsController.$inject = [
        'ExperimentUrisAPI',
        '$stateParams',
        'ExpInfo',
        'loadUris',
        'alert',
        '$state'
    ];

    function EditCredentialsController(
        ExperimentUrisAPI,
        $stateParams,
        ExpInfo,
        loadUris,
        alert,
        $state
    ) {
        var vm = this;
        vm.somethingChanged = false;
        vm.noMoreInfo = false;
        vm.hasAnnotationExperiment = false;

        vm.experimentInfo = ExpInfo.getExperiment();

        vm.change = function() {
            vm.somethingChanged = true;
        };

        vm.callHref = function() {
            $window.open('https://support.zoho.com/portal/organicity/home', '_blank');
        };

        vm.expId = $stateParams.expId;

        vm.clientInfo = ExpInfo.getNewExperiment().clientInfo || {};

        vm.loadingChart = false;
        vm.expId = $stateParams.expId;

        vm.redirectUris = [];
        vm.oldRedirectUris = [];

        init();

        function init() {
            vm.oldRedirectUris = angular.copy(vm.redirectUris);

            var aux = loadUris.data.redirectUris;
            for (var i = 0; i < aux.length; ++i) {
                vm.redirectUris.push({text: aux[i]});
            }
        }

        vm.updateUrns = function() {
            vm.loadingChart = true;

            var aux = [];
            for (var i = 0; i < vm.redirectUris.length; ++i) {
                aux.push(vm.redirectUris[i].text);
            }
            ExperimentUrisAPI.putUris(vm.clientInfo.client_id, aux,
                function() {
                    vm.loadingChart = false;
                    vm.oldRedirectUris = angular.copy(vm.redirectUris);
                    alert.success('Redirect URIs successfully updated');
                },
                function() {
                    vm.loadingChart = false;
                    vm.redirectUris = angular.copy(vm.oldRedirectUris);
                    alert.error('Redirect URIs could not be updated');
                });

        };
        vm.back = function() {
            vm.loadingChart = true;
            $state.go('layout.ep.detail', { expId: vm.expId, onEdit: false });
        };

        vm.goExp = function (){
            $state.go('layout.detail', { expId: vm.experimentInfo.experimentId });
        };
    }
})();
