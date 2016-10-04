(function() {
    'use strict';


    angular.module('app.components')
        .factory('EpDevices', ['$log', 'DevicesAPI', EpDevices]);

    function EpDevices($log, DevicesAPI) {
        var devices = [];

        var service = {
            loadDevices: loadDevices,
            getDevices: getDevices,
            newDevice: newDevice,
        };

        return service;

        function loadDevices(expId, success_, fail_) {
            DevicesAPI.getDevices(expId, success, fail);

            function success(devs) {
                devices = (typeof devs === 'undefined' || devs === null) ? [] : JSON.parse(JSON.stringify(devs));
                success_();
            }

            function fail() {
                fail_();
            }
        }

        function getDevices() {
            return devices;
        }

        function newDevice(expId, info, success_, fail_) {

            DevicesAPI.newDevice(expId, info, success, fail);

            function success() {
                console.log('Sucess')
                success_();
            }

            function fail() {
                console.log('Failed')
                fail_();
            }
        }

    }
})();