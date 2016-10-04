(function() {
    'use strict';

    angular.module('app.components')
        .factory('DevicesAPI', ['$log', 'Restangular', DevicesAPI]);


    function DevicesAPI($log, Restangular) {

        var service = {
            getDevices: getDevices,
            newDevice: newDevice,
            updateDevice: updateDevice,
            removeDevice: removeDevice
        };

        return service;

        function getDevices(experId, success_, fail_) {
            var path = 'experiments/' + experId + '/devices';

            Restangular.one(path).get().then(
                function(res) {
                    success_(res);
                },
                function(res) {
                    fail_(res);
                });

        }

        function newDevice(experId, info, success_, fail_) {
            var path = 'experiments/' + experId + '/devices';
            Restangular.all(path).customPOST(info).then(
                function() {
                    success_();
                },
                function() {
                    fail_();
                });
        }

        function updateDevice(experId, id, info, success_, fail_) {
            var path = 'experiments/' + experId + '/devices/' + id;
            Restangular.one(path).customPUT(info).then(
                function(res) {
                    success_(res);
                },
                function() {
                    fail_();
                });
        }

        function removeDevice(experId, id, success_, fail_) {
            var path = 'experiments/' + experId + '/devices/' + id;

            Restangular.one(path).remove().then(
                function(res) {
                    success_();
                },
                function(res) {
                    fail_();
                });

        }
    }
})();