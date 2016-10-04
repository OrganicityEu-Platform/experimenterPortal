(function() {
    'use strict';

    angular.module('app.components')
        .controller('EditTagsController', EditTagsController);

    EditTagsController.$inject = ['$log', 'EpDictionaries', 'EpExpInfo', '$state', '$stateParams'];

    function EditTagsController($log, EpDictionaries, EpExpInfo, $state, $stateParams) {
        var vm = this;
        vm.domains = angular.copy(EpDictionaries.getDomains());
        vm.selectedDomains = angular.copy(EpExpInfo.getDomains());

        init();

        function init() {
            for (var i = 0; i < vm.selectedDomains.length; i++) {
                for (var j = 0; j < vm.domains.length; j++) {
                    if (vm.selectedDomains[i].urn === vm.domains[j].urn) {
                        vm.domains.splice(j, 1);
                    }
                }
            }
        }
        vm.idxAll = -1;
        vm.idxSel = -1;

        vm.openAll = function(idx) {
            vm.idxSel = -1;
            if (vm.idxAll === idx) {
                vm.idxAll = -1;
            } else {
                vm.idxAll = idx;
            }
        };

        vm.openSel = function(idx) {
            vm.idxAll = -1;
            if (vm.idxSel === idx) {
                vm.idxSel = -1;
            } else {
                vm.idxSel = idx;
            }
        };

        vm.isOpenAll = function(idx) {
            return idx === vm.idxAll;
        };

        vm.isOpenSel = function(idx) {
            return idx === vm.idxSel;
        };

        vm.domainClick = function(domain) {
            vm.idxAll = -1;
            vm.idxSel = -1;
            vm.selectedDomains.push(domain);
            var idx = vm.domains.indexOf(domain);
            if (idx > -1) {
                vm.domains.splice(idx, 1);
            }
        };

        vm.selectedDomainClick = function(domain) {
            vm.idxAll = -1;
            vm.idxSel = -1;
            vm.domains.push(domain);
            var idx = vm.selectedDomains.indexOf(domain);
            if (idx > -1) {
                vm.selectedDomains.splice(idx, 1);
            }
        };

        vm.cancel = function() {
            $state.go('layout.ep.detail', { expId: $stateParams.expId, onEdit: false });
        };

        vm.done = function() {
            EpExpInfo.setNewDomains(vm.selectedDomains);
            $state.go('layout.ep.detail', { expId: $stateParams.expId, onEdit: true });
        };

    }
})();