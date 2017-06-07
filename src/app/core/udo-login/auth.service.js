(function() {
    'use strict';
    angular.module('app.components').factory('auth', auth);
    auth.$inject = [
        '$http',
        '$location',
        '$state',
        '$timeout',
        '$window',
        'jwtHelper',
        'AuthAPI',
        'Config'
    ];

    function auth(
        $http,
        $location,
        $state,
        $timeout,
        $window,
        jwtHelper,
        AuthAPI,
        Config
    ) {
        var user = {
            token: null,
            refresh_token: null,
            data: {}
        };
        var lastCheck = null;
        var refreshingToken = false;
        $timeout(function() {initialize();}, 100);
        var service = {
            isAuth: isAuth,
            getCurrentUser: getCurrentUser,
            getCurrentUserid: getCurrentUserid,
            login: login,
            logout: logout,
            callback: callback,
            getToken: getToken,
            refreshToken: refreshToken
        };
        return service;

        function initialize() {
            initUser();
            var token = $window.localStorage.getItem('organicity.token');
            var refresh_token = $window.localStorage.getItem('organicity.token');
            var data = $window.localStorage.getItem('organicity.data');

            try {
                if (!jwtHelper.isTokenExpired(token) ){
                    user.token = token;
                    user.refresh_token = token;
                    user.data = JSON.parse(data);
                    return $location.path('/experiments');
                } else if (jwtHelper.parse(refresh_token)){
                    refreshToken(refresh_token);
                    return $location.path('/experiments');
                }
            } catch (e){

            }
        }

        function initUser () {
            $window.localStorage.removeItem('organicity.token');
            $window.localStorage.removeItem('organicity.data');
            $window.localStorage.removeItem('organicity.refresh_token');
            user = { token: null, refresh_token: null, data: {}};
        }

        function checkToken () {
            try {
                if (!jwtHelper.isTokenExpired(user.token)) {
                    return;
                }
                if (user.refresh_token !== null && refreshingToken === false) {
                    refreshingToken = true;
                    refreshToken(user.refresh_token);     
                    return;               
                }
            } catch (e){
                logout();
            }
        }

        function refreshToken (tok) {
            return AuthAPI.refreshToken(tok, function(data) {
                user.token = data.access_token;
                user.refresh_token = data.refresh_token;
                var jwt_decoded = jwtHelper.decodeToken(user.token); 
                user.data = {};
                user.data.email = jwt_decoded.email;
                user.data.preferred_username = jwt_decoded.preferred_username;
                user.data.id = jwt_decoded.sub;
                window.localStorage.setItem('organicity.token', user.token);
                window.localStorage.setItem('organicity.refresh_token', user.reresf_token);
                window.localStorage.setItem('organicity.data', JSON.stringify(user.data));
                refreshingToken = false;
                return;
             }, function() {
                refreshingToken = false;
                logout();
                return;
             });
        }

        function getToken () {
            checkToken();
            return user.token;
        }

        function getCurrentUser() {
            return user;
        }

        function getCurrentUserid() {
            return user.data.id;
        }

        function isAuth() {
            if (elapsed()) {
               checkToken();
            }
            return (user.token !== null);
        }


        function login() {
            var winLoc = 'https://accounts.organicity.eu/realms/organicity/protocol/openid-connect/auth?client_id=' +
            Config.client_id + '&response_type=code&redirect_uri=' +
            Config.redirect_uri + '&scope=offline_access';
            window.location.href = winLoc;
        }

        function callback() {
            if (user.token !== null) {
                return $location.path('/experiments');
            }
            var authCode = $location.search()['code'];
            AuthAPI.requireToken(authCode, function(data) {
                user.token = data.access_token;
                user.refresh_token = data.refresh_token;
                var jwt_decoded = jwtHelper.decodeToken(user.token); 
                user.data = {};
                user.data.email = jwt_decoded.email;
                user.data.preferred_username = jwt_decoded.preferred_username;
                user.data.id = jwt_decoded.sub;
                window.localStorage.setItem('organicity.token', user.token);
                window.localStorage.setItem('organicity.refresh_token', user.reresf_token);
                window.localStorage.setItem('organicity.data', JSON.stringify(user.data));
                return $location.path('/experiments');
             }, function(res) {
                return $location.path('/welcome');
             });
        }

        function logout() {
            initUser();
            return $location.path('/welcome');
        }

        function elapsed () {
            if (lastCheck === null) {
                lastCheck = new Date();
                return true;
            }
            var now = new Date();
            if ( (now - lastCheck) > 1000 ) {
                lastCheck = new Date();
                return true;   
            }
            return false;
        }
    }
})();
