(function() {
    'use strict';

    angular.module('app')
        .config(config);

    /*
      Check app.config.js to know how states are protected
    */

    config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$logProvider', 'RestangularProvider'];

    function config($stateProvider, $urlRouterProvider, $locationProvider, $logProvider, RestangularProvider) {
        $stateProvider.state('callback', {
                url: '/',
                authenticate: false,
                resolve: {
                    callback: function(auth) {
                        auth.callback();
                    }
                }
            })
            .state('layout', {
                url: '',
                abstract: true,
                templateUrl: 'app/components/layout/layout.html',
                controller: 'LayoutController',
                controllerAs: 'vm'
            })
            .state('layout.welcome', {
                url: '/welcome',
                views: { 
                    'content@layout': {
                        templateUrl: 'app/components/ep/welcome.html',
                        controller: 'WelcomeController',
                        controllerAs: 'vm',
                        resolve: {
                            islogged: function(auth) {
                                auth.logout();
                            }
                        }
                    }
                },
            })
            .state('layout.static', {
                url: '/static',
                views: { 
                    'content@layout': {
                        templateUrl: 'app/components/static/static.html',
                        controller: 'StaticController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('layout.exps', {
                url: '/experiments',
                views: {
                    'content@layout': {
                        templateUrl: 'app/components/ep/experiments.html',
                        controller: 'ExperimentsController',
                        controllerAs: 'vm',
                        resolve: {
                            islogged: function(auth) {
                                if (!auth.isAuth()) {
                                    return auth.logout();
                                }
                            },
                            load: function(Experiments, $q) {
                                var defer = $q.defer();
                                Experiments.loadExperiments(
                                    function() { defer.resolve({ success: true }); },
                                    function() { defer.resolve({ success: false }); }
                                );
                                return defer.promise;
                            }
                        }
                    }
                }
            })
            .state('layout.newExpInfo', {
                abstract: true,
                url: ''
            })
            .state('layout.newExpInfo.info', {
                url: '/new-experiment/info',
                views: {
                    'content@layout': {
                        templateUrl: 'app/components/edit-experiment/newExpInfo.html',
                        controller: 'NewExpInfoController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    islogged: function($location, auth) {
                        if (!auth.isAuth()) {
                            return auth.logout();
                        }
                    }
                }
            })
            .state('layout.newExpInfo.area', {
                url: '/new-experiment/area',
                views: {
                    'content@layout': {
                        templateUrl: 'app/components/edit-experiment/newArea.html',
                        controller: 'NewExpAreaController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    islogged: function($location, auth) {
                        if (!auth.isAuth()) {
                            return auth.logout();
                        }
                    }
                }
            })
            .state('layout.detail', {
                url: '/detail/:expId',
                views: {
                    'content@layout': {
                        templateUrl: 'app/components/ep/experiment/experimentInfo.html',
                        controller: 'ExperimentInfoController',
                        controllerAs: 'vm'
                    }
                },
                resolve:{
                    islogged: function($location, auth) {
                        if (!auth.isAuth()) {
                            return auth.logout();
                        }
                    },
                    loadExpInfo: function($q, ExpInfo, $stateParams) {
                        var defer = $q.defer();
                        ExpInfo.loadExp($stateParams.expId,
                            function() {
                                defer.resolve({ success: true });
                            },
                            function() { defer.resolve({ success: false }); }
                        );
                        return defer.promise;
                    }
                }
            })
            .state('layout.appInfo', {
                url: '/:expId/detail/application/:appId?onEdit',
                views: {
                    'content@layout': {
                        templateUrl: 'app/components/edit-application/appDetail.html',
                        controller: 'AppDetailController',
                        controllerAs: 'vm',
                        resolve: {
                            loadApp: function($q, $state, AppInfo, $stateParams) {
                                if ($stateParams.onEdit === 'true') {
                                    return;
                                }
                                var defer = $q.defer();
                                defer.promise.then(function() {
                                    return;
                                }, function() {
                                    return $state.go('layout.exps');
                                });
                                AppInfo.loadApp($stateParams.expId, $stateParams.appId, defer.resolve, defer.reject);
                                return defer.promise;
                            },
                            islogged: function($location, auth) {
                                if (!auth.isAuth()) {
                                    return auth.logout();
                                }
                            }
                        }
                    }
                }
            })
            .state('layout.expEdition', {
                abstract: true,
                url: '',
            })
            .state('layout.expEdition.area', {
                url: '/:expId/experiment-edition/area',
                views: {
                    'content@layout': {
                        templateUrl: 'app/components/edit-experiment/editArea.html',
                        controller: 'EditAreaController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    islogged: function($location, auth) {
                        if (!auth.isAuth()) {
                            return auth.logout();
                        }
                    },
                    loadExpInfo: function($q, ExpInfo, $stateParams) {
                        var defer = $q.defer();
                        ExpInfo.loadExp($stateParams.expId,
                            function() {
                                defer.resolve({ success: true });
                            },
                            function() { defer.resolve({ success: false }); }
                        );
                        return defer.promise;
                    }
                }
            })
            .state('layout.expEdition.tags', {
                url: '/:expId/experiment-edition/tags',
                views: {
                    'content@layout': {
                        templateUrl: 'app/components/edit-tags/editTags.html',
                        controller: 'EditTagsController',
                        controllerAs: 'vm',
                        resolve: {
                            islogged: function($location, auth) {
                                if (!auth.isAuth()) {
                                    return auth.logout();
                                }
                            },
                            loadSelectedSDomains: function(Annotations, $q, $stateParams) {
                                var defer = $q.defer();
                                Annotations.loadSelectedDomains($stateParams.expId,
                                    function() { defer.resolve({ success: true }); },
                                    function() { defer.resolve({ success: false }); }
                                );
                                return defer.promise;
                            },
                            loadAllDomains: function(Annotations, $q) {
                                var defer = $q.defer();
                                Annotations.loadAllDomains(
                                    function() { defer.resolve({ success: true }); },
                                    function() { defer.resolve({ success: false }); }
                                );
                                return defer.promise;
                            }
                        }
                    }
                }
            })
            .state('layout.expEdition.credentials', {
                url: '/:expId/experiment-edition/credentials',
                views: {
                    'content@layout': {
                        templateUrl: 'app/components/edit-credentails/editCredentials.html',
                        controller: 'EditCredentialsController',
                        controllerAs: 'vm',
                        resolve: {
                            islogged: function($location, auth) {
                                if (!auth.isAuth()) {
                                    return auth.logout();
                                }
                            },
                            loadUris: function(ExperimentUrisAPI, $q, ExpInfo, $state, $stateParams) {
                                var defer = $q.defer();
                                ExpInfo.loadExp($stateParams.expId,
                                    function () {
                                        var cliId = ExpInfo.getNewExperiment().clientInfo.client_id;
                                        ExperimentUrisAPI.getUris(cliId,
                                            function(res) {
                                                return defer.resolve({ data: res });
                                            },
                                            function() {
                                                return defer.resolve($state.go('layout.detail', { expId: $stateParams.expId}));
                                            });
                                    }, 
                                    function() { return defer.resolve($state.go('layout.detail', { expId: $stateParams.expId})); }
                                );
                                return defer.promise;
                            }
                        }
                    }
                }
            })
            .state('layout.expEdition.assets', {
                url: '/:expId/experiment-edition/assets',
                views: {
                    'content@layout': {
                        templateUrl: 'app/components/ep/assets/expAssets.html',
                        controller: 'ExpAssetsController',
                        controllerAs: 'vm',
                        resolve: {
                            islogged: function($location, auth) {
                                if (!auth.isAuth()) {
                                    return auth.logout();
                                }
                            },
                            loadAssets: function(Devices, $stateParams, ExpInfo, $q, $state) {
                                var defer = $q.defer();
                                ExpInfo.loadExp($stateParams.expId,
                                    function () {  
                                    Devices.loadDevices($stateParams.expId,
                                        function(res) {
                                            return defer.resolve({data: res}); 
                                        },
                                        function() {
                                            return defer.resolve($state.go('layout.detail', { expId: $stateParams.expId}));
                                        });
                                    },
                                    function() { return defer.resolve($state.go('layout.detail', { expId: $stateParams.expId})); }
                                );
                                return defer.promise;
                            }
                        }
                    }
                }
            })
            .state('layout.expEdition.apps', {
                url: '/:expId/experiment-edition/apps',
                views: {
                    'content@layout': {
                        templateUrl: 'app/components/ep/application/experimentApps.html',
                        controller: 'ExperimentAppsController',
                        controllerAs: 'vm',
                        resolve: {
                            islogged: function($location, auth) {
                                if (!auth.isAuth()) {
                                    return auth.logout();
                                }
                            },
                            loadApps: function(Applications, $stateParams, ExpInfo, $q, $state) {
                                var defer = $q.defer();
                                ExpInfo.loadExp($stateParams.expId,
                                    function () {  
                                    Applications.loadApps($stateParams.expId,
                                        function(res) {
                                            return defer.resolve({data: res}); 
                                        },
                                        function() {
                                            return defer.resolve($state.go('layout.detail', { expId: $stateParams.expId}));
                                        });
                                    },
                                    function() { return defer.resolve($state.go('layout.detail', { expId: $stateParams.expId})); }
                                );
                                return defer.promise;
                            }
                        }
                    }
                }
            })
             .state('layout.expEdition.participants', {
                url: '/:expId/experiment-edition/participants',
                views: {
                    'content@layout': {
                        templateUrl: 'app/components/ep/community/community.html',
                        controller: 'CommunityController',
                        controllerAs: 'vm',
                        resolve: {
                            islogged: function($location, auth) {
                                if (!auth.isAuth()) {
                                    return auth.logout();
                                }
                            },
                            loadParts: function(Community, $stateParams, ExpInfo, $q, $state) {
                                var defer = $q.defer();
                                ExpInfo.loadExp($stateParams.expId,
                                    function () {  
                                    Community.loadInvitations($stateParams.expId,
                                        function(res) {
                                            return defer.resolve({data: res}); 
                                        },
                                        function() {
                                            return defer.resolve($state.go('layout.detail', { expId: $stateParams.expId}));
                                        });
                                    },
                                    function() { return defer.resolve($state.go('layout.detail', { expId: $stateParams.expId})); }
                                );
                                return defer.promise;
                            }
                        }
                    }
                }
            })
            .state('layout.newApp', {
                url: '/:expId/new-application',
                views: {
                    'content@layout': {
                        templateUrl: 'app/components/edit-application/newApp.html',
                        controller: 'NewApplicationController',
                        controllerAs: 'vm',
                        resolve: {
                            islogged: function($location, auth) {
                                if (!auth.isAuth()) {
                                    return auth.logout();
                                }
                            }
                        }
                    }
                }
            })

        .state('layout.newApp.sePlugins', {
                url: '/:expId/new-application/sePlugins',
                views: {
                    'content@layout': {
                        templateUrl: 'app/components/edit-sePlugins/seEditPlugins.html',
                        controller: 'SeEditPluginsController',
                        controllerAs: 'vm',
                        resolve: {
                            loadPlugins: function($q, Dictionaries, $rootScope) {
                                var defer = $q.defer();
                                defer.promise.then(function() {
                                    return;
                                }, function() {
                                    $rootScope.$emit('sePluginsLoadFail', '');
                                    return;
                                });
                                Dictionaries.loadSePlugins(defer.resolve, defer.reject);
                                return defer.promise;
                            },
                            islogged: function($location, auth) {
                                if (!auth.isAuth()) {
                                    return auth.logout();
                                }
                            }
                        }
                    }
                }
            })
            .state('layout.sePlugins', {
                url: '/:expId/app-edition/:appId/sePlugins',
                views: {
                    'content@layout': {
                        templateUrl: 'app/components/edit-sePlugins/seEditPlugins.html',
                        controller: 'SeModifyPluginsController',
                        controllerAs: 'vm',
                        resolve: {
                            loadPlugins: function($q, Dictionaries, $rootScope) {
                                var defer = $q.defer();
                                defer.promise.then(function() {
                                    return;
                                }, function() {
                                    $rootScope.$emit('sePluginsLoadFail', '');
                                    return;
                                });
                                Dictionaries.loadSePlugins(defer.resolve, defer.reject);
                                return defer.promise;
                            },
                            islogged: function($location, auth) {
                                if (!auth.isAuth()) {
                                    return auth.logout();
                                }
                            }
                        }
                    }
                }
            })
            .state('layout.newAsset', {
                url: '/:expId/new-asset',
                views: {
                    'content@layout': {
                        templateUrl: 'app/components/edit-device/newDevice.html',
                        controller: 'NewDeviceController',
                        controllerAs: 'vm',
                        resolve: {
                            loadExpInfo: function($q, ExpInfo, $stateParams) {
                                var defer = $q.defer();
                                ExpInfo.loadExp($stateParams.expId,
                                    function() {
                                        defer.resolve({ success: true });
                                    },
                                    function() { defer.resolve({ success: false }); }
                                );
                            return defer.promise;
                            },
                            islogged: function($location, auth) {
                                if (!auth.isAuth()) {
                                    return auth.logout();
                                }
                            }
                        }
                    }
                }
            })
            .state('layout.editAssets', {
                url: '/:expId/editAsset',
                views: {
                    'content@layout': {
                        templateUrl: 'app/components/edit-assets/editAssets.html',
                        controller: 'EditAssetsController',
                        controllerAs: 'vm',
                        resolve: {
                            islogged: function($location, auth) {
                                if (!auth.isAuth()) {
                                    return auth.logout();
                                }
                            }
                        }
                    }
                }
            });

        /* Default state */
        $urlRouterProvider.otherwise('/welcome');

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        }).hashPrefix('!');

        RestangularProvider.setBaseUrl('http://localhost:8081');
        //RestangularProvider.setBaseUrl('https://localhost:8443');
        //RestangularProvider.setBaseUrl('https://experimenters.organicity.eu:8443');

        /* Remove angular leaflet logs */
        $logProvider.debugEnabled(false);
    }
})();
