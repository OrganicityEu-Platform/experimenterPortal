(function() {
    'use strict';

    angular.module('app.components').factory('AuthAPI', [
        'Config',
        '$http',
        AuthAPI
    ]);


    function AuthAPI(
        Config,
        $http
    ) {

        var service = {
            requireToken: requireToken,
            refreshToken: refreshToken
        };

        return service;

        function requireToken(code, success, fail) {
            var options = {
                method: 'POST',
                url: 'http://localhost:8081/accounts/require-token',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: {
                    client_id: Config.client_id,
                    grant_type: 'authorization_code',
                    redirect_uri: Config.redirect_uri,
                    code: code
                }
            };
            $http(options).then(function(res) {
                 return success(res.data);
            }, function(res) {
                return fail(res);
            });
        }

        function refreshToken(tok, success, fail) {
            var options = {
                method: 'POST',
                url: 'http://localhost:8081/accounts/refresh-token',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: {
                    client_id: Config.client_id,
                    grant_type: 'refresh_token',
                    refresh_token: tok
                }
            };
            $http(options).then(function(res) {
                 return success(res.data);
            }, function(res) {
                return fail(res);
            });
        }
    }
})();
