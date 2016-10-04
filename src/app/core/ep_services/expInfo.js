(function() {
    'use strict';

    angular.module('app.components')
        .factory('EpExpInfo', ['$log', 'ExperimentsAPI', 'TagsAPI', 'Upload', 'auth', EpExpInfo]);


    function EpExpInfo($log, ExperimentsAPI, TagsAPI, Upload, auth) {

        var experiment = null;
        var newExperiment = null;
        var newArea = false;
        var newDomains = false;
        var tagDomains = null;
        var newTagDomains = null;

        var service = {
            flush: flush,
            loadExp: loadExp,
            setNewName: setNewName,
            setNewDescription: setNewDescription,
            setNewStart: setNewStart,
            setNewEnd: setNewEnd,
            setNewStatus: setNewStatus,
            setNewRegions: setNewRegions,
            setAssetsPublic: setAssetsPublic,
            getExperiment: getExperiment,
            getNewExperiment: getNewExperiment,
            update: update,

            areaModified: areaModified,
            reset: reset,

            getDomains: getDomains,
            setNewDomains: setNewDomains,
            domainsModified: domainsModified,
            updateDomains: updateDomains,
            loadDomains: loadDomains,
            uploadIcon: uploadIcon,
            addExperimenter: addExperimenter,
            getMainExperimenter: getMainExperimenter
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
            tagDomains = null;
            newTagDomains = null;
            newArea = false;
            newDomains = false;
        }

        function setNewName(name) {
            newExperiment.name = name;
        }

        function setNewDescription(desc) {
            newExperiment.description = desc;
        }

        function setNewStart(start) {
            newExperiment.startDate = start;
        }

        function setNewEnd(end) {
            newExperiment.endDate = end;
        }

        function setNewStatus (status) {
            newExperiment.status = status;
        }

        function setNewRegions(regions) {
            newArea = true;
            newExperiment.area = regions;
        }

        function setAssetsPublic (assetsPublic) {
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
                newArea = false;
                newDomains = false;
                return success_();
            }

            function fail() {
                newExperiment = angular.copy(experiment);
                newArea = false;
                newDomains = false;
                return fail_();
            }
        }

        function areaModified() {
            return newArea;
        }

        function reset() {
            newExperiment = angular.copy(experiment);
            newTagDomains = angular.copy(tagDomains);
            newArea = false;
            newDomains = false;
        }

        function getDomains() {
            return (newTagDomains !== null ? newTagDomains : []);
        }

        function setNewDomains(domains_) {

            newTagDomains = domains_;
            newDomains = true;
        }

        function domainsModified() {
            return newDomains;
        }

        function updateDomains(success_, fail_) {
            var data = {
                toAdd: [],
                toRemove: []
            };
            if (tagDomains === null) {
                return success_();
            }

            for (var i = 0; i < tagDomains.length; i++) {
                var idx = newTagDomains.indexOf(tagDomains[i]);
                if (idx < 0) {
                    data.toRemove.push(tagDomains[i].urn);
                }
            }

            for (i = 0; i < newTagDomains.length; i++) {
                var idx2 = tagDomains.indexOf(tagDomains[i]);
                if (idx2 < 0) {
                    data.toAdd.push(newTagDomains[i].urn);
                }
            }

            TagsAPI.setDomains(experiment.experimentId, data, success, fail);

            function success() {
                tagDomains = angular.copy(newTagDomains);
                return success_();
            }

            function fail() {
                newTagDomains = angular.copy(tagDomains);
                return fail_();
            }
        }

        function loadDomains(id, success_, fail_) {

            newDomains = false;

            TagsAPI.getDomains(id, loaded, fail);

            function loaded(domains_) {
                tagDomains = domains_;
                newTagDomains = angular.copy(tagDomains);
                return success_();
            }

            function fail() {
                newTagDomains = angular.copy(tagDomains);
                return fail_();
            }
        }

        function uploadIcon(id, file, success_, fail_) {
            var authHdr = "";
            if (auth.isAuth()) {
                var token = auth.getCurrentUser().token;
                authHdr = 'Bearer ' + JSON.stringify(token);
            }
            Upload.upload({
                //url: 'http://localhost:8081/experiments/' + id + '/logo',
                url: 'https://localhost:8443/experiments/' + id + '/logo',
                //url: 'https://experimenters.organicity.eu:8443/experiments/' + id + '/logo',
                file: file,
                method: 'POST',
                headers: { 'Authorization': authHdr }

            }).then(function(resp) {
                success_();
            }, function(resp) {
                fail_();
            });
        }

        function addExperimenter (id, email, success_, fail_) {
            ExperimentsAPI.addExperimenter(id, email, success_, fail_);
        }

        function getMainExperimenter() {
            return experiment.mainExperimenterId;
        }

    }
})();