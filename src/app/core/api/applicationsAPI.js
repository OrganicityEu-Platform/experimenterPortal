(function() {
    'use strict';

    angular.module('app.components')
        .factory('ApplicationsAPI', ['Restangular', ApplicationsAPI]);


    function ApplicationsAPI(Restangular) {

        var service = {
            getApps: getApps,
            getApp: getApp,
            newApp: newApp,
            updateApp: updateApp,
            removeApp: removeApp
        };

        return service;

        function getApps(experId, success_, fail_) {
            var path = 'experiments/' + experId + '/applications';

            Restangular.one(path).get().then(
                function(res) {
                    success_(res);
                },
                function() {
                    fail_();
                });
        }

        function getApp(experId, appId, success_, fail_) {
            var path = 'experiments/' + experId + '/applications/' + appId;

            Restangular.one(path).get().then(
                function(res) {
                    success_(res);
                },
                function() {
                    fail_();
                });

        }

        function newApp(experId, info, success_, fail_) {
            var path = 'experiments/' + experId + '/applications';

            
            Restangular.one(path).customPOST(info).then(
                function() {
                    success_();
                },
                function() {
                    fail_();
                });
        }

        function updateApp(experId, id, info, success_, fail_) {
            var path = 'experiments/' + experId + '/applications/' + id;
            Restangular.one(path).customPUT(info).then(
                function(res) {
                    success_(res);
                },
                function() {
                    fail_();
                });
        }

        function removeApp(experId, id, success_, fail_) {
            var path = 'experiments/' + experId + '/applications/' + id;

            Restangular.one(path).remove().then(
                function(res) {
                    success_();
                },
                function(res) {
                    fail_();
                });

        }
    }
})();
