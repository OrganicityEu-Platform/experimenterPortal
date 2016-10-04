(function() {
    'use strict';

    angular.module('app.components')
        .factory('EpNewExperiment', ['$log', EpNewExperiment]);


    function EpNewExperiment($log) {

        var experiment = {
            name: null,
            description: null,
            startDate: null,
            endDate: null,
            area: null,
            assetsPublic: true
        };

        var service = {
            flush: flush,
            setName: setName,
            setAssetsPublic: setAssetsPublic,
            setDescription: setDescription,
            setStart: setStart,
            setEnd: setEnd,
            setRegions: setRegions,
            getExperiment: getExperiment
        };

        return service;

        function flush() {
            experiment.name = null;
            experiment.description = null;
            experiment.startDate = null;
            experiment.endDate = null;
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
