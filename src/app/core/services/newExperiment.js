(function() {
    'use strict';

    angular.module('app.components')
        .factory('NewExperiment', [NewExperiment]);


    function NewExperiment() {

        var experiment = {
            name: null,
            description: null,
            area: null,
            assetsPublic: true
        };

        var service = {
            flush: flush,
            setName: setName,
            setAssetsPublic: setAssetsPublic,
            setDescription: setDescription,
            setRegions: setRegions,
            getExperiment: getExperiment
        };

        return service;

        function flush() {
            experiment.name = null;
            experiment.description = null;
            experiment.area = null;
            experiment.assetsPublic = true;
        }

        function setName(name) {
            experiment.name = name;
        }

        function setDescription(desc) {
            experiment.description = desc;
        }

        function setStart(start) {
            experiment.startDate = start;
        }

        function setEnd(end) {
            experiment.endDate = end;
        }

        function setRegions(regions) {
            experiment.area = regions;
        }

        function setAssetsPublic (arePublic) {
            experiment.assetsPublic = arePublic;
        }

        function getExperiment() {
            return experiment;
        }



    }
})();
