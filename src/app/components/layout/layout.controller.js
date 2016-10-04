(function() {
    'use strict';

    angular.module('app.components')
        .controller('LayoutController', LayoutController);

    LayoutController.$inject = ['auth', 'animation', '$timeout'];

    function LayoutController(auth, animation, $timeout) {
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
                    vm.hello = 'Hello, ' + vm.currentUser.username;
                }
            }, 500);
        }

        function logout() {
            auth.logout();
            
        }

        vm.isLoggedin = function () {
            return auth.isAuth();
        }

        function login() {
            auth.login();
        }
    }
})();