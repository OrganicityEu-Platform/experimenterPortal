(function() {
    'use strict';
    angular.module('app.components').factory('ExpInfo', [
        'ExperimentsAPI',
        'Upload',
        'auth',
        '$rootScope',
        ExpInfo
    ]);

    function ExpInfo(
        ExperimentsAPI,
        Upload,
        auth,
        $rootScope
    ) {
        var experiment = null;
        var newExperiment = null;
        var service = {
            flush: flush,
            loadExp: loadExp,
            setNewName: setNewName,
            setNewDescription: setNewDescription,
            setNewStatus: setNewStatus,
            setNewRegions: setNewRegions,
            setNewAssetsPublic: setNewAssetsPublic,
            getExperiment: getExperiment,
            getNewExperiment: getNewExperiment,
            update: update,
            reset: reset,
            addExperimenter: addExperimenter,
            getMainExperimenter: getMainExperimenter,
            getAreaArray: getAreaArray,
            clearNewExp : clearNewExp
        };
        return service;

        function loadExp(id, success_, fail_) {
            ExperimentsAPI.getExperiment(id, success, fail);

            function success(item) {
                experiment = item;
                newExperiment = angular.copy(experiment);
                return success_();
            }

            function fail() {
                return fail_();
            }
        }

        function flush() {
            experiment = null;
            newExperiment = null;
        }

        function setNewName(name) {
            newExperiment.name = name;
        }

        function setNewDescription(desc) {
            newExperiment.description = desc;
        }

        function setNewStatus(status) {
            newExperiment.status = status;
        }

        function setNewRegions(regions) {
            newExperiment.area = regions;
        }

        function setNewAssetsPublic(assetsPublic) {
            newExperiment.assetsPublic = assetsPublic;
        }

        function getNewExperiment() {
            return (newExperiment !== null ? newExperiment : {});
        }

        function getExperiment() {
            return (experiment !== null ? experiment : {});
        }

        function update(success_, fail_) {
            ExperimentsAPI.updateExperiment(experiment.experimentId, newExperiment, success, fail);
            function success(exp) {
                experiment = exp;
                newExperiment = angular.copy(experiment);
                return success_();
            }

            function fail() {
                newExperiment = angular.copy(experiment);
                newArea = false;
                return fail_();
            }
        }

        function reset() {
            newExperiment = angular.copy(experiment);
        }

        function addExperimenter(id, email, success_, fail_) {
            ExperimentsAPI.addExperimenter(id, email, success_, fail_);
        }

        function getMainExperimenter() {
            return experiment.mainExperimenterId;
        }

        function getAreaArray() {
            var aux = [];
            for (var i = 0; i < experiment.area.length; i++) {
                aux.push(experiment.area[i].coordinates);
            }
            return aux;
        }

        function clearNewExp () {
            newExperiment = null;
        }
    }
})();
