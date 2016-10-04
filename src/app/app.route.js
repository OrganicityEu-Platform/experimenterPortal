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


        

        .state('layout.ep', {
            url: '',
            abstract: true,
            templateUrl: 'app/components/ep/eplayout.html',
            controller: 'EpLayoutController',
            controllerAs: 'vm',
            resolve: {
                loadTools: function($q, EpDictionaries) {
                    var defer = $q.defer();
                    EpDictionaries.loadTools(function() {
                        defer.resolve({ success: true });
                    }, function() {
                        defer.resolve({ success: false });
                    });
                    return defer.promise;
                },
            }

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

        .state('layout.ep.exps', {
            url: '/experiments',
            views: {
                'content@layout.ep': {
                    templateUrl: 'app/components/ep/epExperiments.html',
                    controller: 'EpExperimentsController',
                    controllerAs: 'vm',
                    resolve: {
                        islogged: function($state, auth) {
                            if (!auth.isAuth()) {
                                return auth.logout();
                            }
                        },
                        load: function(Experiments, $q, $state) {
                            var defer = $q.defer();
                            Experiments.loadExperiments(function() {
                                defer.resolve({ success: true });
                            }, function() {
                                defer.resolve({ success: false });
                            });
                            return defer.promise;
                        }
                    }
                }
            }
        })

        /*
         * Paths to create a new experiment: generic information
         * and area (regions)
         */

        .state('layout.ep.newExpInfo', {
            abstract: true,
            url: ''
        })

        .state('layout.ep.newExpInfo.info', {
                url: '/new-experiment/info',
                views: {
                    'content@layout.ep': {
                        templateUrl: 'app/components/ep_new-experiment/newExpInfo.html',
                        controller: 'EpNewExpInfoController',
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
            .state('layout.ep.newExpInfo.area', {
                url: '/new-experiment/area',
                views: {
                    'content@layout.ep': {
                        templateUrl: 'app/components/ep_new-experiment/newExpArea.html',
                        controller: 'EpNewExperAreaController',
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

        /**
         * Experiment detail        
         */
        .state('layout.ep.detail', {
            url: '/detail/:expId?onEdit',
            views: {
                'content@layout.ep': {
                    templateUrl: 'app/components/ep/epExpDetail.html',
                    resolve: {
                        loadExpInfo: function($q, $state, EpExpInfo, $rootScope, $stateParams) {
                            if ($stateParams.onEdit) {
                                return { success: true };
                            }
                            var defer = $q.defer();
                            defer.promise.then(function() {
                            }, function() {
                                return $rootScope.$emit('experimentInfoFail', 'info');
                            });
                            EpExpInfo.loadExp($stateParams.expId, defer.resolve, defer.reject);
                            return defer.promise;
                        },
                    }
                },
                'experimentInfo@layout.ep.detail': {
                    templateUrl: 'app/components/ep/epExperimentInfo.html',
                    controller: 'EpExperimentInfoController',
                    controllerAs: 'vm',
                    resolve: {
                        loadExpDomains: function($q, EpExpInfo, $stateParams) {
                            if ($stateParams.onEdit) {
                                return { success: true };
                            }
                            var defer = $q.defer();
                            EpExpInfo.loadDomains($stateParams.expId, function() {
                                defer.resolve({ success: true });
                            }, function() {
                                defer.resolve({ success: false });
                            });
                            return defer.promise;
                        }
                    }
                },
                'apps@layout.ep.detail': {
                    templateUrl: 'app/components/ep/epExperimentApps.html',
                    controller: 'EpExperimentAppsController',
                    controllerAs: 'vm',
                    resolve: {
                        loadApps: function($q, EpApplications, $stateParams) {
                            var defer = $q.defer();
                            EpApplications.loadApps($stateParams.expId,
                                function() {
                                    defer.resolve({ success: true });
                                },
                                function() {
                                    defer.resolve({ success: false });
                                });


                            return defer.promise;
                        },
                    }

                },
                'exp_assets@layout.ep.detail': {
                    templateUrl: 'app/components/ep/epExpAssets.html',
                    controller: 'EpExpAssetsController',
                    controllerAs: 'vm',
                    resolve: {
                        loadDevices: function($q, EpDevices, $stateParams) {
                            var defer = $q.defer();
                            EpDevices.loadDevices($stateParams.expId,
                                function() {
                                    defer.resolve({ success: true });
                                },
                                function() {
                                    defer.resolve({ success: false });
                                });
                            return defer.promise;
                        }
                    }
                },
                // 'sel_assets@layout.ep.detail': {
                //     templateUrl: 'app/components/ep/epSelAssets.html',
                //     controller: 'EpSelAssetsController',
                //     controllerAs: 'vm',
                // },
                'exp_community@layout.ep.detail': {
                    templateUrl: 'app/components/ep/community.html',
                    controller: 'CommunityController',
                    controllerAs: 'vm',
                    resolve: {
                        loadInvitations: function($q, EpCommunity, $stateParams) {
                            var defer = $q.defer();
                            EpCommunity.loadInvitations($stateParams.expId,
                                function() {
                                    defer.resolve({ success: true });
                                },
                                function() {
                                    defer.resolve({ success: false });
                                });
                            return defer.promise;
                        }
                    }
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

        /*
         * Information of the selected application
         */
        .state('layout.ep.appInfo', {
            url: '/:expId/detail/application/:appId?onEdit',
            views: {
                'content@layout.ep': {
                    templateUrl: 'app/components/ep/epAppDetail.html',
                    controller: 'EpAppDetailController',
                    controllerAs: 'vm',
                    resolve: {
                        loadApp: function($q, $state, AppInfo, $stateParams) {
                            if ($stateParams.onEdit) {
                                return;
                            }
                            var defer = $q.defer();
                            defer.promise.then(function() {
                                return;
                            }, function() {
                                return $state.go('layout.ep.exps');
                            });

                            AppInfo.loadApp($stateParams.expId, $stateParams.appId, defer.resolve, defer.reject);
                            return defer.promise;
                        },
                        loadAppTypes: function($q, $state, EpDictionaries) {

                            var defer = $q.defer();
                            defer.promise.then(function() {
                                return;
                            }, function() {
                                return $state.go('layout.ep.exps');
                            });
                            EpDictionaries.loadAppTypes(defer.resolve, defer.reject);
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

        /**
         * Experiment edition
         */
        .state('layout.ep.expEdition', {
            abstract: true,
            url: '',
        })

        .state('layout.ep.expEdition.area', {
            url: '/:expId/experiment-edition/area',
            views: {
                'content@layout.ep': {
                    templateUrl: 'app/components/ep_editArea/editArea.html',
                    controller: 'EditAreaController',
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

        .state('layout.ep.expEdition.tags', {
            url: '/:expId/experiment-edition/tags',
            views: {
                'content@layout.ep': {
                    templateUrl: 'app/components/ep_editTags/epEditTags.html',
                    controller: 'EditTagsController',
                    controllerAs: 'vm',
                }
            },
            resolve: {
                loadDomains: function($q, EpDictionaries, $rootScope) {
                    var defer = $q.defer();
                    defer.promise.then(function() {
                        return;
                    }, function() {
                        return $rootScope.$emit('allTagDomainsInfoFail', '');
                    });
                    EpDictionaries.loadDomains(defer.resolve, defer.reject);
                    return defer.promise;
                },
                islogged: function($location, auth) {
                    if (!auth.isAuth()) {
                        return auth.logout();
                    }
                }
            }
        })


        /*
         * Paths to create a new application
         */
        .state('layout.ep.newApp', {
            url: '/:expId/new-application',
            views: {
                'content@layout.ep': {
                    templateUrl: 'app/components/ep_new-application/newApp.html',
                    controller: 'EpNewApplicationController',
                    controllerAs: 'vm',
                    resolve: {
                        loadAppTypes: function($q, EpDictionaries, $rootScope) {
                            var defer = $q.defer();
                            defer.promise.then(function() {
                                return;
                            }, function() {
                                return $rootScope.$emit('appTypesFail', '');
                            });
                            EpDictionaries.loadAppTypes(defer.resolve, defer.reject);
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

        .state('layout.ep.newApp.sePlugins', {
            url: '/:expId/new-application/sePlugins',
            views: {
                'content@layout.ep': {
                    templateUrl: 'app/components/ep_editSePlugins/seEditPlugins.html',
                    controller: 'SeEditPluginsController',
                    controllerAs: 'vm',
                    resolve: {
                        loadPlugins: function($q, EpDictionaries, $rootScope) {
                            var defer = $q.defer();
                            defer.promise.then(function() {
                                return;
                            }, function() {
                                $rootScope.$emit('sePluginsLoadFail', '');
                                return;
                            });
                            EpDictionaries.loadSePlugins(defer.resolve, defer.reject);
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



        /**
         * Application edition
         */
        .state('layout.ep.appEdition', {
            abstract: true,
            url: '',
        })

        .state('layout.ep.appEdition.sePlugins', {
            url: '/:expId/app-edition/:appId/sePlugins',
            views: {
                'content@layout.ep': {
                    templateUrl: 'app/components/ep_editSePlugins/seEditPlugins.html',
                    controller: 'SeModifyPluginsController',
                    controllerAs: 'vm',
                    resolve: {
                        loadPlugins: function($q, EpDictionaries, $rootScope) {
                            var defer = $q.defer();
                            defer.promise.then(function() {
                                return;
                            }, function() {
                                $rootScope.$emit('sePluginsLoadFail', '');
                                return;
                            });
                            EpDictionaries.loadSePlugins(defer.resolve, defer.reject);
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

        /*
         * Paths to create a new asset
         */

        .state('layout.ep.newAsset', {
            url: '/:expId/new-asset',
            views: {
                'content@layout.ep': {
                    templateUrl: 'app/components/ep_newDev/epNewDevice.html',
                    controller: 'EpNewDeviceController',
                    controllerAs: 'vm',
                    resolve: {
                        loadAssetsInfo: function($q, EpDictionaries, $rootScope) {
                            var defer = $q.defer();
                            defer.promise.then(function() {}, function() {
                                $rootScope.$emit('assetDictsFail', '');
                            });
                            EpDictionaries.loadAssetDict(defer.resolve, defer.reject);
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