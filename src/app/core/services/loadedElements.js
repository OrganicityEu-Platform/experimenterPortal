(function() {
    'use strict';

    angular.module('app.components').factory('LoadedElements', [LoadedElements]);

    function LoadedElements() {
        var expInfo = false;
        var apps = false;
        var devices = false;
        var assets = false;
        var tagDomains = false;
        var expTags = false;
        var invs = false;

        var service = {
            setExpInfo: function (tf) {expInfo = tf;},
            setApps: function (tf) {apps = tf;},
            setDevices: function (tf) {devices = tf;}, 
            setAssets: function (tf) {assets = tf;},
            setTagDomains: function (tf) {tagDomains = tf;},
            setExpTags: function (tf) {expTags = tf;},
            setInvs: function (tf) {invs = tf;},
            //
            getExpInfo: function () {return expInfo;},
            getApps: function () {return apps;},
            getDevices: function () {return devices;}, 
            getAssets: function () {return assets;},
            getTagDomains: function () {return tagDomains;},
            getExpTags: function () {return expTags;},
            getInvs: function () {return invs;}
        };
        return service;
    }
})();