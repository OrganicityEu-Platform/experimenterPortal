(function() {
    'use strict';

    angular.module('app.components')
        .factory('FmsDictAPI', ['$log', 'Restangular', FmsDictAPI]);


    function FmsDictAPI($log, Restangular) {

        var service = {
            getAssets: getAssets,
            getTools: getTools,
            getApps: getApps
        };

        return service;

        function getAssets(success_, fail_) {

            var path = 'dictionaries/assets';
            Restangular.one(path).get().then(
                function(res) {
                    return success_(res.plain());
                },
                function(res) {
                    return fail_();
                });

        }

        function getTools(success_, fail_) {
            var path = 'dictionaries/tools';
            Restangular.one(path).get().then(
                function(res) {
                    return success_(res.plain());
                },
                function() {
                    return fail_();
                });
        }

        function getApps(success_, fail_) {
            var path = 'dictionaries/applications';
            Restangular.one(path).get().then(
                function(res) {
                    return success_(res.plain());
                },
                function() {
                    return fail_();
                });
        }

    }
})();