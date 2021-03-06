(function() {
  'use strict';

  angular.module('app.components').factory('file', file);

    file.$inject = ['Restangular', 'Upload'];
    function file(Restangular, Upload) {
      var service = {
        getCredentials: getCredentials,
        uploadFile: uploadFile,
        getImageURL: getImageURL
      };
      return service;

      ///////////////

      function getCredentials(filename) {
        var data = {
          filename: filename
        };
        return accountsAPI.all('me/avatar').post(data);
      }

      function uploadFile(fileData, key, policy, signature) {
        return Upload.upload({
          url: 'https://organicity.s3-eu-west-1.amazonaws.com', //Not working temp example
          method: 'POST',
          fields: {
            key: key,
            policy: policy,
            signature: signature,
            AWSAccessKeyId: 'AKIAJ753OQI6JPSDCPHA',
            acl: 'public-read',
            /*jshint camelcase: false */
            success_action_status: 200
          },
          file: fileData
        });
      }

      function getImageURL(filename, size) {
        size = size === undefined ? 's101' : size;

        return 'https://images.organicity.eu/' + size + '/' + filename;  //Not working temp example
      }
    }
})();
