(function() {
    'use strict';


    angular.module('app.components')
        .factory('EpApplications', ['ApplicationsAPI', EpApplications]);

    function EpApplications(ApplicationsAPI) {

        var applications = [];

        var service = {
            loadApps: loadApps,
            getApps: getApps,
            removeApp: removeApp,
            newApp: newApp,
        };

        return service;

        function loadApps(expId, success_, fail_) {

            ApplicationsAPI.getApps(expId, success, fail);

            function success(apps) {
                applications = apps;
                success_();
            }

            function fail() {
                fail_();
            }
        }

        function getApps() {
            return applications;
        }

        function removeApp(expId, appId, success_, fail_) {
            ApplicationsAPI.removeApp(expId, appId, success, fail);

            function success() {
                for (var i = 0; i < applications.length; i++) {
                    if (appId === applications[i].applicationId) {
                        applications.splice(i, 1);
                    }
                }
                success_();
            }

            function fail() {
                fail_();
            }
        }

        function newApp(expId, info, success_, fail_) {
            ApplicationsAPI.newApp(expId, info, success, fail);

            function success(app) {
                success_();
            }

            function fail() {
                fail_();
            }
        }
    }
})();
