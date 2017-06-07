(function() {
    'use strict';

    function FilterOutByUrn(str, inArray) {
        var aux = [];
        for (var i = 0; i < inArray.length; i++) {
            if (inArray[i].urn.search(str) === -1) {
                aux.push(inArray[i]);
            }
        }
        return aux;
    }

    function FilterOutByArray(inArray, otherArray) {
        var aux = [];
        for (var i = 0; i < inArray.length; i++) {
            var f = false;
            for (var j = 0; j < otherArray.length; j++) {
                if (otherArray[j].urn === inArray[i].urn) {
                    f = true;
                    break;
                }
            }
            if (!f) {
                aux.push(inArray[i]);
            }
        }
        return aux;
    }

    function FindByUrn(str, inArray) {
        var aux = [];
        for (var i = 0; i < inArray.length; i++) {
            if (inArray[i].urn.search(str) !== -1) {
                aux.push(inArray[i]);
            }
        }
        return aux;
    }

    function Tags2ShowArr(arr) {
        for (var i = 0; i < arr.length; ++i) {
            var aux = [];
            var auxStr = [];
            for (var j = 0; j < arr[i].tags.length; ++j) {
                if (auxStr.indexOf(arr[i].tags[j].name) === -1) {
                    aux.push({ text: arr[i].tags[j].name });
                    auxStr.push(arr[i].tags[j].name);
                }
            }
            arr[i].tags = aux;
        }
        return arr;
    }

    function Tags2Show(tags) {
        var aux = [];
        var auxStr = [];
        for (var j = 0; j < tags.length; ++j) {
            var idx = auxStr.indexOf(tags[j].name);
            if (idx === -1) {
                aux.push({ text: tags[j].name });
            }
        }
        return aux;
    }

    function Tags2Send(prefix, dom) {
        var aux = [];
        for (var j = 0; j < dom.tags.length; ++j) {
            aux.push({
                name: dom.tags[j].text,
                urn: prefix + ':' + dom.tags[j].text
            });
        }
        dom.tags = aux;
        return dom;
    }

    angular.module('app.components').controller('EditTagsController', EditTagsController);
    EditTagsController.$inject = [
        'ExpInfo',
        'Annotations',
        '$state',
        'alert',
        '$stateParams',
        'loadSelectedSDomains',
        '$window'
    ];

    function EditTagsController(
        ExpInfo,
        Annotations,
        $state,
        alert,
        $stateParams,
        loadSelectedSDomains,
        $window
    ) {
        var vm = this;

        vm.experimentInfo = ExpInfo.getExperiment();
        vm.somethingChanged = false;
        vm.hasAnnotationExperiment = loadSelectedSDomains.success;

        vm.callHref = function() {
            $window.open('https://support.zoho.com/portal/organicity/home', '_blank');
        };

        vm.loadingChart = false;
        vm.expId = $stateParams.expId;

        vm.prefix = 'urn:oc:tagDomain:experiments:' + vm.expId;
        vm.inNewDomain = false;
        vm.newDomain = {};

        vm.allDomains = [];
        vm.selectedDomains = [];
        vm.experimentDomains = [];

        vm.addDomainCancel = function() {
            vm.newDomain = {};
            vm.inNewDomain = false;
        };

        vm.createDomain = function() {
            vm.loadingChart = true;
            var auxDom = angular.copy(vm.newDomain);
            auxDom.urn = vm.prefix + ":" + auxDom.urn;
            auxDom.description = ExpInfo.getExperiment().name + '-' + auxDom.urn;
            auxDom = Tags2Send(auxDom.urn, auxDom);


            vm.loadingChart = true;
            Annotations.createDomain(vm.expId, auxDom, function() {
                alert.success('Tag domain has been created');
                vm.newDomain = {};
                vm.loadingChart = false;
                vm.inNewDomain = false;
                init();
            }, function() {
                alert.error('Tag domain could not be created');
                vm.newDomain = {};
                vm.loadingChart = false;
                vm.inNewDomain = false;
                init();
            });
        };

        init();

        function init() {
            vm.loadingChart = true;
            vm.allDomains = angular.copy(Annotations.getAllDomains());
            vm.selectedDomains = angular.copy(Annotations.getSelectedDomains());
            vm.experimentDomains = angular.copy(Annotations.getAllDomains());
            vm.experimentDomains = Tags2ShowArr(vm.experimentDomains);
            vm.experimentDomains = FindByUrn(vm.prefix, vm.experimentDomains);
            vm.allDomains = FilterOutByUrn('urn:oc:tagDomain:experiments:', vm.allDomains);
            vm.allDomains = FilterOutByUrn('urn:oc:entity:experimenters:', vm.allDomains);
            vm.selectedDomains = FilterOutByUrn('urn:oc:tagDomain:experiments:', vm.selectedDomains);
            vm.allDomains = FilterOutByArray(vm.allDomains, vm.selectedDomains);
            vm.loadingChart = false;
        }

        vm.updateTags = function(idx) {
            vm.loadingChart = true;
            vm.experimentDomains[idx].isChanged = false;
            var auxDom = angular.copy(vm.experimentDomains[idx]);
            auxDom = Tags2Send(vm.experimentDomains[idx].urn, auxDom);

            Annotations.updateTags(auxDom, function(tags) {
                alert.success('Tags updated');
                vm.experimentDomains[idx].tags = Tags2Show(tags);
                vm.loadingChart = false;
                vm.inNewDomain = false;
            }, function(tags) {
                alert.error('Tags could not be updated');
                vm.experimentDomains[idx].tags = Tags2Show(tags);
                vm.loadingChart = false;
                vm.inNewDomain = false;
            });
        };

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
        vm.domainClick = function(idx) {
            vm.somethingChanged = true;
            vm.selectedDomains.push(vm.allDomains[idx]);
            vm.allDomains.splice(idx, 1);
        };
        vm.selectedDomainClick = function(idx) {
            vm.somethingChanged = true;
            vm.allDomains.push(vm.selectedDomains[idx]);
            vm.selectedDomains.splice(idx, 1);
        };

        vm.updateDomains = function() {
            vm.somethingChanged = false;
            vm.loadingChart = true;
            Annotations.updateDomains(vm.expId, vm.selectedDomains, function(doms) {
                alert.success('Selected domains updated');
                vm.experimentDomains = doms;
                init();
                vm.loadingChart = false;
            }, function(doms) {
                alert.error('Selected domains update failed');
                vm.selectedDomains = doms;
                init();
                vm.loadingChart = false;
            });
        };
        vm.back = function() {
            vm.loadingChart = true;
            $state.go('layout.detail', { expId: vm.expId, onEdit: false });
        };
        vm.goHome = function (){
            $state.go('layout.exps');
        };

        vm.goExp = function (){
            $state.go('layout.detail', { expId: vm.experimentInfo.experimentId });
        };

        vm.callHref = function (ref) {
            $window.open(ref, '_blank');
        };
    }
})();
