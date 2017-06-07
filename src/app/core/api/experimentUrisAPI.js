(function() {
    'use strict';

    angular.module('app.components').factory('ExperimentUrisAPI', [
        'Restangular', 
        ExperimentUrisAPI
    ]);

    function ExperimentUrisAPI(
        Restangular
    ) {

        var uris = null;

        var service = {
            getUris: getUris,
            putUris: putUris
        };

        return service;

        function getUris (cliId, success, fail) {
            var path = 'experiments/'+ cliId + '/credentials';
            Restangular.one(path).get().then(function (res) {
                return success(res.plain());
            }, function (){
                return fail([]);
            });
        }

        function putUris (cliId, uris, success, fail) {
            var path = 'experiments/'+ cliId + '/credentials';
            Restangular.one(path).customPOST({redirectUris: uris}).then(function () {
                return success();
            }, function (){
                return fail();
            });
        }
    }
})();