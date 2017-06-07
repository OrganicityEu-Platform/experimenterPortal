(function() {
    'use strict';
    angular.module('app.components').factory('NewTagsAPI', [
        'Restangular',
        '$http',
        'auth',
        NewTagsAPI
    ]);

    function NewTagsAPI(
        Restangular,
        $http,
        auth
    ) {
        var api = Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl('https://annotations.organicity.eu');
        });

        var service = {
            getAllDomains: getAllDomains,
            getDomains: getDomains,
            addDomains: addDomains,
            deleteDomains: deleteDomains,
            getTags: getTags,
            addTags: addTags,
            deleteTags: deleteTags,
            createDomain: createDomain
        };
        return service;

        function getAllDomains(success, fail) {

            var options = {
                method: 'GET',
                url: 'https://annotations.organicity.eu/tagDomains',
                //url: './app/core/api/allDomains.js',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + auth.getToken()
                },
                transformResponse: function(res, header) {
                    return res;
                }
            };

            $http(options).then(function(res) {
                return success(JSON.parse(res.data));
            }, function(res) {
                return fail();
            });
        }

        function getDomains(urn, success, fail) {
            
            var path = 'admin/experiments/' + urn + '/tagDomains';
            var options = {
                method: 'GET',
                url: 'https://annotations.organicity.eu/' + path,
                //url: './app/core/api/expDomains.js',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + auth.getToken()
                },
                transformResponse: function(res, header) {
                    return res;
                }
            };
            console.log(options)

            $http(options).then(function(res) {
                try {
                    return success(JSON.parse(res.data));
                } catch (e) {
                    return success([]);
                }
            }, function(res) {
                return fail();
            });
        }

        function addDomains(urn, domains, success, fail) {
            var path = 'admin/experiments/' + urn + '/tagDomains?tagDomainUrn=' + domains;
            var options = {
                method: 'POST',
                url: 'https://annotations.organicity.eu/' + path,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + auth.getToken()
                },
                transformResponse: function(res, header) {
                    return res;
                }
            };
            $http(options).then(function() {
                return success();
            }, function() {
                return fail();
            });
        }

        function deleteDomains(urn, domains, success, fail) {
            var path = 'admin/experiments/' + urn + '/tagDomains?tagDomainUrn=' + domains;
            var options = {
                method: 'DELETE',
                url: 'https://annotations.organicity.eu/' + path,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + auth.getToken()
                },
                transformResponse: function(res, header) {
                    return res;
                }
            };
            $http(options).then(function() {
                return success();
            }, function() {
                return fail();
            });
        }

        function getTags(expId, success_, fail_) {
            var path = 'tagDomains/urn:oc:tagDomain:experiments:' + expId;
            api.one(path).get().then(function(res) {
                if (res !== undefined) {
                    return success_(res.plain().tags);
                }
                return success_([]);
            }, function(res) {
                return fail_();
            });
        }

        function addTags(urn, data, success, fail) {
            var path = 'admin/tagDomains/' + urn + '/tags';

            var options = {
                method: 'POST',
                url: 'https://annotations.organicity.eu/' + path,
                headers: {
                    'Authorization': 'Bearer ' + auth.getToken(),
                    'Accept': 'application/json'
                },
                data: data,
                transformResponse: function(res, header) {
                    return res;
                }
            };

            $http(options).then(function() {
                success();
            }, function() {
                fail();
            });
        }

        function deleteTags(urn, data, success, fail) {
            var path = 'admin/tagDomains/' + urn + '/tags';
            var options = {
                method: 'DELETE',
                url: 'https://annotations.organicity.eu/' + path,
                headers: {
                    'Authorization': 'Bearer ' + auth.getToken(),
                    'Accept': 'application/json'
                },
                data: data,
                transformResponse: function(res, header) {
                    return res;
                }
            };
            $http(options).then(function() {
                return success();
            }, function() {
                return fail();
            });
        }

        function createDomain(data, success, fail) {
            console.log('Creating domain');
            
            var options = {
                method: 'POST',
                url: 'https://annotations.organicity.eu/admin/tagDomains',
                headers: {
                    'Authorization': 'Bearer ' + auth.getToken(),
                    'Accept': 'application/json'
                },
                data: data,
                transformResponse: function(res, header) {
                    return res;
                }
            };

            $http(options).then(function() {
                return success();
            }, function() {
                return fail();
            });
        }
    }
})();
