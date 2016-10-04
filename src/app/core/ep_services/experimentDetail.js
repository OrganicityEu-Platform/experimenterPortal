(function() {
    'use strict';


    angular.module('app.components')
        .factory('ExperimentDetail', ['$log', 'ExperimentsAPI', 'ApplicationsAPI', 'DevicesAPI', 'AssetsAPI', 'TagsAPI',
            ExperimentDetail
        ]);

    function ExperimentDetail($log, ExperimentsAPI, ApplicationsAPI, DevicesAPI, AssetsAPI, TagsAPI) {


        var assets = [];
        var allTagDomains = [];
        var tagDomains = [];



        var service = {
            flush: flush,

            // assets
            loadAssets: loadAssets,
            getAssets: getAssets,
            newAsset: newAsset,
            // tag domains
            getAllDomains: getAllDomains,
            getDomains: getDomains,
            updateDomains: updateDomains,
            loadDomains: loadDomains,
        };

        return service;

        function loadAssets(success_, fail_) {
            AssetsAPI.getAssets(experimentInfo.experimentId, success, fail);

            function success(items) {
                assets = items;
                success_();
            }

            function fail() {
                fail_();
            }
        }

        function getAssets() {
            return assets;
        }

        function newAsset(info, success_, fail_) {
            AssetsAPI.newAsset(experimentInfo.experimentId, info, success, fail);

            function success() {
                loadAssets(success_, fail);
            }

            function fail() {
                fail_();
            }
        }

        function removeAsset(id, success_, fail_) {
            AssetsAPI.removeAsset(experimentInfo.experimentId, devId, success, fail);

            function success() {
                for (var i = 0; i < assets.length; i++) {
                    if (id === assets[i].datasourceId) {
                        devices.splice(i, 1);
                    }
                }
                success_();
            }

            function fail() {
                fail_();
            }
        }

        function getAllDomains(success_, fail_) {
            return allTagDomains;
        }

        function getDomains() {
            return tagDomains;
        }

        function updateDomains(info) {

        }

        function loadDomains(success_, fail_) {
            TagsAPI.getAllDomains(allLoaded, fail_);

            function allLoaded(domains) {
                allTagDomains = domains;
                TagsAPI.getDomains(experimentInfo.experimentId, loaded, fail_);
            }

            function loaded(domains) {
                tagDomains = domains;
                success_();
            }
        }



        function flush() {
            experimentInfo = {};
            app = [];
            devices = [];
            assets = [];
        }
    }
})();
