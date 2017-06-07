(function() {
    'use strict';

    angular.module('app.components')
        .factory('DevicesAPI', ['Restangular', DevicesAPI]);


    function DevicesAPI(Restangular) {

        var service = {
            getDevices: getDevices,
            newDevice: newDevice,
            updateDevice: updateDevice,
            removeDevice: removeDevice
        };

        return service;

        function getDevices(experId, success, fail) {
            var path = 'assets/experiment/' + experId;
            Restangular.one(path).get().then(success, fail);
        }

        function newDevice(experId, info, success, fail) {
            var path = 'experiments/' + experId + '/devices';
            Restangular.all(path).customPOST(info).then(success, fail);
        }

        function updateDevice(experId, id, info, success, fail) {
            var path = 'experiments/' + experId + '/devices/' + id;
            Restangular.one(path).customPUT(info).then( function (info){
                return success(info);
            },function (info) {
                return fail(info);
            });
        }

        function removeDevice(experId, id, success, fail) {
            var path = 'experiments/' + experId + '/devices/' + id;
            Restangular.one(path).remove().then(success, fail);
        }

    }
})();