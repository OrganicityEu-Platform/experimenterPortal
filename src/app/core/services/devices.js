(function() {
    'use strict';


    angular.module('app.components').factory('Devices', [
        'DevicesAPI',
        Devices]);

    function Devices(
        DevicesAPI
    ) {
        var devices = [];

        var service = {
            loadDevices: loadDevices,
            getDevices: getDevices,
            newDevice: newDevice,
            updateDevice: updateDevice
        };

        return service;

        function loadDevices(expId, success_, fail) {
            DevicesAPI.getDevices(expId, success, fail);
            function success(devs) {
                devices = (typeof devs === 'undefined' || devs === null) ? {} : devs;
                success_();
            }
        }

        function getDevices() {
            return devices;
        }

        function newDevice(expId, info, success, fail) {
            DevicesAPI.newDevice(expId, info, success, fail);
        }

        function updateDevice(expId, info, success, fail) {
            DevicesAPI.updateDevice(expId, info.id, info, success, fail);
        }

    }
})();