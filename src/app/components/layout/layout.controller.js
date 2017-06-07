(function() {
    'use strict';

    angular.module('app.components')
        .controller('LayoutController', LayoutController);

    LayoutController.$inject = [
    'auth', 
    'animation', 
    '$timeout',
    '$window'
    ];

    function LayoutController(
        auth, 
        animation, 
        $timeout,
        $window
    ) {
        var vm = this;


        vm.logout = logout;
        vm.login = login;

        initialize();

             //////////////////

        function initialize() {
            $timeout(function() {
                animation.viewLoaded();
                if (auth.isAuth()) {
                    vm.currentUser = auth.getCurrentUser().data;

                    vm.hello = 'Hello, ' + vm.currentUser.preferred_username;
                }
            }, 500);
        }

        function logout() {
            auth.logout();
        }

        vm.isLoggedin = function() {
            return auth.isAuth();
        };

        function login() {
            auth.login();
        }

         vm.callHref = function (ref) {
            $window.open(ref, '_blank');
        };

        vm.docref = 'https://organicityeu.github.io';
        vm.github = 'https://github.com/OrganicityEu/';
        vm.zoho = 'https://support.zoho.com/portal/organicity/home';
        vm.q2a = 'http://dev.qa.organicity.eu/index.php'
;    }
})();
