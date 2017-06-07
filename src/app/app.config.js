(function() {
    'use strict';

    angular.module('app').run(run);

    run.$inject = [
        '$rootScope',
        'Restangular',
        'auth',
        '$window',
        'animation'
    ];

    function run(
        $rootScope,
        Restangular,
        auth,
        $window,
        animation
    ) {
        //$window.localStorage.clear();
        $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
            animation.hideAlert();
            $window.scrollTo(0, 0);
            return;
        });

        Restangular.addFullRequestInterceptor(function(element, operation, what, url, headers, params, httpConfig) {
            var token = auth.getToken();
            headers.Authorization = 'Bearer ' + token;
            
            return {
                element: element,
                headers: headers,
                params: params,
                httpConfig: httpConfig
            };
        });
    }
})();
