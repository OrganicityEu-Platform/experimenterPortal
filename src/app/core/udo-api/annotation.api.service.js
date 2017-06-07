(function () {
  'use strict';

  angular.module('app.components')
    .factory('annotationAPI', function (Restangular) {
      return Restangular.withConfig(function (RestangularConfigurer) {
        //RestangularConfigurer.setBaseUrl('http://127.0.0.1:3000'); //Dev cache
        //RestangularConfigurer.setBaseUrl('http://localhost:8084/'); //todo
        RestangularConfigurer.setBaseUrl('http://146.169.46.162:8084/'); //todo put domain name
        //RestangularConfigurer.setBaseUrl('https://organicityassetsdiscovery-fpgpcgrrbc.now.sh/'); //Temp 30sec cached for speed
      });
    });

})();
