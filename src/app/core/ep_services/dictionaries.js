(function() {
    'use strict';


    angular.module('app.components')
        .factory('EpDictionaries', ['$log', 'TagsAPI', 'FmsDictAPI', 'SmartphoneExpAPI', EpDictionaries]);

    function EpDictionaries($log, TagsAPI, FmsDictAPI, SmartphoneExpAPI) {
        var domains = [];
        var assetTypes = [];
        var attributeTypes = [];
        var dataTypes = [];
        var unitTypes = [];
        var tools = [];
        var appTypes = [];
        var sePlugins = [];

        var service = {
            loadDomains: loadDomains,
            getDomains: getDomains,
            loadAssetDict: loadAssetDict,
            getAssetTypes: getAssetTypes,
            getAttributeTypes: getAttributeTypes,
            getDataTypes: getDataTypes,
            getUnitTypes: getUnitTypes,
            loadTools: loadTools,
            getTools: getTools,
            loadAppTypes: loadAppTypes,
            getAppTypes: getAppTypes,
            loadSePlugins: loadSePlugins,
            getSePlugins: getSePlugins
        };

        return service;

        function loadDomains(success_, fail_) {
            TagsAPI.getAllDomains(success, fail);

            function success(domains_) {
                domains = domains_;
                success_();
            }

            function fail() {
                domains = [];
                fail_();
            }
        }

        function getDomains() {
            return domains;
        }

        function loadAssetDict(success_, fail_) {

            FmsDictAPI.getAssets(success, fail);

            function success(res) {
                assetTypes = angular.copy(res.assetTypes);
                dataTypes = angular.copy(res.dataTypes);
                attributeTypes = angular.copy(res.attributeTypes);
                unitTypes = angular.copy(res.unitTypes);
                return success_();
            }

            function fail() {
                assetTypes = [];
                dataTypes = [];
                attributeTypes = [];
                unitTypes = [];
                return fail_();
            }
        }

        function getAssetTypes() {
            return assetTypes;
        }

        function getAttributeTypes() {
            return attributeTypes;
        }

        function getDataTypes() {
            return dataTypes;
        }

        function getUnitTypes() {
            return unitTypes;
        }

        function loadTools(success_, fail_) {

            FmsDictAPI.getTools(success, fail);

            function success(res) {
                tools = angular.copy(res);
                return success_();
            }

            function fail() {
                tools = [];
                return fail_();
            }
        }

        function getTools() {
            return tools;
        }

        function loadAppTypes(success_, fail_) {
            FmsDictAPI.getApps(success, fail);

            function success(res) {
                appTypes = angular.copy(res);
                return success_();
            }

            function fail() {
                appTypes = [];
                return fail_();
            }
        }

        function getAppTypes() {
            return appTypes;

// return             [
//   {
//     "urn": "string",
//     "name": "smartphone",
//     "description": "string"
//   }
// ]

        }

        function loadSePlugins(success_, fail_) {
            SmartphoneExpAPI.getPlugins(success, fail);

            function success(res) {
                sePlugins = angular.copy(res);
                return success_();
            }

            function fail() {
                sePlugins = [];
                return fail_();
            }
        }

        function getSePlugins() {
            return sePlugins;
        }
    }
})();