(function() {
    'use strict';


    angular.module('app.components').factory('Config', [
        Config
    ]);

    function Config() {

        var client_id = 'experimenter-portal-dev';
        var redirect_uri = 'http://localhost:8080/';

        var service = {
            client_id: client_id,
            redirect_uri: redirect_uri
        };

        return service;
    }
})();
