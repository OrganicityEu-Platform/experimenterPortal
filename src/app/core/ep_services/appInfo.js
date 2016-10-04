(function() {
    'use strict';


    angular.module('app.components')
        .factory('AppInfo', ['ApplicationsAPI', AppInfo]);

    function AppInfo(ApplicationsAPI) {

        var app = null;
        var newApp = null;
        var newPlugins = false;

        var service = {
            flush: flush,
            loadApp: loadApp,
            setNewName: setNewName,
            setNewDescription: setNewDescription,
            setNewLink: setNewLink,
            setNewType: setNewType,
            getApp: getApp,
            getNewApp: getNewApp,
            getSePlugins: getSePlugins,
            setNewSePlugins: setNewSePlugins,
            pluginsModified: pluginsModified,
            update: update,
            reset: reset
        };

        return service;

        function flush() {
            app = null;
            newApp = null;
            newPlugins = false;
        }

        function loadApp(expId, appId, success_, fail_) {
            ApplicationsAPI.getApp(expId, appId, success, fail);

            function success(app_) {
                app = app_;
                newApp = angular.copy(app);
                success_();
            }

            function fail() {
                fail_();
            }
        }

        function setNewName(name) {
            newApp.name = name;
        }

        function setNewDescription(description) {
            newApp.description = description;
        }

        function setNewLink(link) {
            newApp.link = link;
        }

        function setNewType(type) {
            newApp.type = type;
        }

        function getApp() {
            return (app !== null ? app : {});
        }

        function getNewApp() {
            return (newApp !== null ? newApp : {});
        }

        function getSePlugins() {
            console.log(app.more.sensorDependencies)
            return (app.more.sensorDependencies !== undefined ? app.more.sensorDependencies : []);
        }

        function setNewSePlugins(plugins) {
            try {
                newApp.more.sensorDependencies = plugins;
            } catch (e) {
                newApp.more = {sensorDependencies: plugins};
            }
            newPlugins = true;
        }

        function pluginsModified() {
            return newPlugins;
        }

        function update(success_, fail_) {

            ApplicationsAPI.updateApp(app.experimentId, app.applicationId, newApp, success, fail);

            function success(app) {
                app = app;
                success_();
            }

            function fail() {
                fail_();
            }
        }

        function reset() {
            newPlugins = false;
            newApp = angular.copy(app);
        }
    }
})();