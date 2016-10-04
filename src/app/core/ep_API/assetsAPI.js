(function() {
    'use strict';

    angular.module('app.components')
        .factory('EpAssetsAPI', ['$log', 'Restangular', EpAssetsAPI]);


    function EpAssetsAPI($log, Restangular) {

        var service = {
            getAssets: getAssets,
            updateAsset: updateAsset,
        };

        return service;

        function getAssets(experId, success_, fail_) {

            var path = 'experiments/' + experId + '/datasources';
            Restangular.one(path).get().then(
                function(res) {
                    success_(res.datasources);
                },
                function(res) {
                    fail_(res);
                });

        }

        function updateAsset(experId, info, success_, fail_) {
            var path = 'experiments/' + experId + '/datasources';
            Restangular.one(path).customPUT(info).then(
                function(res) {
                    success_(res);
                },
                function() {
                    fail_();
                });
        }
    }
})();
