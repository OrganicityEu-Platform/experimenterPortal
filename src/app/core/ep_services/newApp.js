(function() {
    'use strict';

    angular.module('app.components')
        .factory('EpNewApp', ['$log', EpNewApp]);


    function EpNewApp($log) {
        var app = {
            name: null,
            description: null,
            type: null,
            link: null,
            more: {}
        };

        var service = {
            flush: flush,
            setName: setName,
            setDescription: setDescription,
            setType: setType,
            setLink: setLink,
            getMore: getMore,
            setMore: setMore,
            getApp: getApp
        };

        return service;


        function flush() {
            app = {
                name: null,
                description: null,
                type: null,
                link: null,
                more: {}
            };
        }

        function setName(name) {
            app.name = name;
        }

        function setDescription(desc) {
            app.description = desc;
        }

        function setType(type) {
            app.type = type;
        }

        function setLink(link) {
            app.link = link;
        }

        function getMore() {
            return app.more;
        }

        function setMore(more) {
            app.more = more;
        }

        function getApp() {
            return app;
        }

    }
})();
