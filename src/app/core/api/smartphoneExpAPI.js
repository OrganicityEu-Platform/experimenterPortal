(function() {
    'use strict';

    angular.module('app.components')
        .factory('SmartphoneExpAPI', ['Restangular', SmartphoneExpAPI]);


    function SmartphoneExpAPI(Restangular) {

        var service = {
            getPlugins: getPlugins,
        };

        return service;

        function getPlugins(success_, fail_) {
            var path = 'se/plugin';
            Restangular.one(path).get().then(
                function(res) {
                    success_(res.plugins);
                },
                function(res) {
                    fail_(res);
                });

        }
    }
})();
