(function() {
  'use strict';
  angular.module('app.components')
   .config(function ($provide) {

        // var airbrake = new airbrakeJs.Client();

        // airbrake.setProject('xxx', 'xxx');
        // airbrake.setHost('https://errors.organicity.eu');  // Example not yet ready

        $provide.decorator('$exceptionHandler', ['$delegate', function($delegate) {
          return function (exception, cause) {
            /*jshint camelcase: false */
            // exception.params = { angular_cause: cause };
            // airbrake.notify(exception);
            $delegate(exception, cause);
          };
        }]);

    });
})();
