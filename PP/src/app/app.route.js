(function() {
    'use strict';

    angular.module('app').config(config);

    /*
      Check app.config.js to know how states are protected
    */

    config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$logProvider', 'RestangularProvider'];

    function config($stateProvider, $urlRouterProvider, $locationProvider, $logProvider, RestangularProvider) {
        $stateProvider

        /*
        -- Layout state --
        Top-level state used for inserting the layout(navbar and footer)
        */
            .state('layout', {
                url: '',
                abstract: true,
                templateUrl: 'app/components/layout/layout.html',
                controller: 'LayoutController',
                controllerAs: 'vm'
            })


        .state('layout.welcome', {
            url: '/welcome',
            templateUrl: 'app/components/ep/welcome.html',
            controller: 'EpWelcomeController',
            controllerAs: 'vm'
        })

        .state('layout.parts', {
            url: '/participants',
            templateUrl: 'app/components/ep/invPortal.html',
            controller: 'InvPortalController',
            controllerAs: 'vm',
            resolve: {
                islogged: function($state, auth) {
                            if (!auth.isAuth()) {
                                return auth.logout();
                            }
                        },
                loadInvitations: function ($q, EpCommunity) {
                    var defer = $q.defer();
                    EpCommunity.loadParInvitations (function () {
                        defer.resolve();
                    }, function () {
                        defer.resolve();
                    });
                    return defer.promise;
                }
            },
        })

      

       /*
        -- Callback --
        It saves token from accounts organicity
        */
        .state('callback', {
            url: '/',
            authenticate: false,
            resolve: {
                callback: function($location, $state, auth, $rootScope) {
                    auth.callback();
                }
            }
        })

        /* Default state */
        $urlRouterProvider.otherwise('/welcome');

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        }).hashPrefix('!');

        //RestangularProvider.setBaseUrl('http://localhost:8081');
        //RestangularProvider.setBaseUrl('https://localhost:8443');
        RestangularProvider.setBaseUrl('https://experimenters.organicity.eu:8443');


        /* Remove angular leaflet logs */
        $logProvider.debugEnabled(false);
    }
})();