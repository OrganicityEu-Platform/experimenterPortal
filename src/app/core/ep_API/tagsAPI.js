(function() {
    'use strict';

    angular.module('app.components')
        .factory('TagsAPI', ['$log', 'Restangular', TagsAPI]);


    function TagsAPI($log, Restangular) {

        var service = {
            getAllDomains: getAllDomains,
            getDomains: getDomains,
            setDomains: setDomains
        };

        return service;

        function getAllDomains(success_, fail_) {

            var path = 'tags/domains';
            Restangular.one(path).get().then(
                function(res) {
                    return success_(res.plain());
                },
                function(res) {
                    return fail_();
                });

        }

        function getDomains(expId, success_, fail_) {
            var path = 'tags/domains/' + expId;
            Restangular.one(path).get().then(
                function(res) {
                    return success_(res.plain());
                },
                function(res) {
                    return fail_(res);
                });
        }

        function setDomains(expId, info, success_, fail_) {
            var path = 'tags/domains/' + expId;
            Restangular.one(path).customPUT(info).then(
                function() {
                    return success_();
                },
                function() {
                    return error_();
                });
        }

    }
})();
