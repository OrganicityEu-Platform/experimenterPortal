(function() {
    'use strict';

    angular.module('app.components')
        .controller('EpAppDetailController', EpAppDetailController);

    EpAppDetailController.$inject = ['$state', 'AppInfo', 'alert', 'EpDictionaries', '$stateParams',
        '$mdDialog', '$rootScope', 'EpExpInfo'
    ];

    function EpAppDetailController($state, AppInfo, alert, EpDictionaries, $stateParams,
        $mdDialog, $rootScope, EpExpInfo) {
        var vm = this;

        vm.appInfo = AppInfo.getNewApp();
        vm.experimenterId = EpExpInfo.getMainExperimenter();
        vm.plugins = [];

        vm.changed = false;

        vm.currentInfo = {
            name: vm.appInfo.name,
            description: vm.appInfo.description,
            link: vm.appInfo.link,
            type: vm.appInfo.type,
            more: vm.appInfo.more || {}
        };

        console.log('Controller loading ...')

        vm.resultsLink = 'https://set.organicity.eu/experiment/certain/' + vm.appInfo.applicationId;
        vm.codeuploadLink = 'https://set.organicity.eu/experiment/updateJar/' + vm.appInfo.applicationId;
        vm.sensorjarUpload = 'https://set.organicity.eu/plugin/addPlugin';
        vm.pluginsSelection = 'https://set.organicity.eu/plugin/userPlugins'

        vm.isSe = function() {
            return (vm.currentInfo.type === 'smartphone');
        };


        init();

        function init() {
            if (!vm.isSe() ) {
                return;
            }

            try {
            var strArray = vm.appInfo.more.sensorDependencies.split(',');
                for (var i = 0; i < strArray.length; i++) {
                    var aux = strArray[i].split('.');
                    vm.plugins.push(aux.pop());
                }
            }
            catch (e) {}
        }

        vm.update = function() {
            AppInfo.setNewName(vm.currentInfo.name);
            AppInfo.setNewDescription(vm.currentInfo.description);
            AppInfo.setNewLink(vm.currentInfo.link);
            AppInfo.setNewType(vm.currentInfo.type);
            AppInfo.update(successUpdate, errorUpdate);
            vm.changed = true;
        };

        function successUpdate() {
            vm.changed = false;
            alert.success('Application successfully updated');
            $state.go($state.current, {}, { reload: true });
        }

        function errorUpdate() {
            vm.changed = false;
            alert.error('Application could not be updated. Try it later');
            vm.reset();
        }

        vm.goToExperiment = function() {
            $state.go('layout.ep.detail', {
                expId: $stateParams.expId
            });
        };

        function success() {
            vm.goToExperiment();
        }

        function fail() {
            vm.goToExperiment();
        }

        vm.reset = function() {
            AppInfo.reset();
            $state.go($state.current, {}, { reload: true });
        };


        vm.submit = function(fileData) {
            if (fileData && fileData.length) {
                console.log('Trying to upload ');
                console.log(fileData[0]);
                vm.upload(fileData[0]);
            }
        };

        vm.upload = function(file) {
            console.log(file);
            Upload.upload({
                url: 'http://localhost:8081/se/appcode',
                file: file,
                method: 'POST'
            }).then(function(resp) {
                console.log('Success ' + resp.config.file.name + 'uploaded. Response: ' + resp.data);
            }, function(resp) {
                console.log('Error status: ' + resp.status);
            }, function(evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
            });
        };

        vm.updatePlugins = function() {
            vm.loadingChart = true;
            $state.go('layout.ep.appEdition.sePlugins', { expId: $stateParams.expId, appId: $stateParams.appId });
        };

        vm.pluginsModified = function() {
            return AppInfo.pluginsModified();
        };

        vm.showPluginsFailed = function() {
            $mdDialog.show({
                locals: {
                    mdInfo: {
                        proceed: function() { $mdDialog.hide(); },
                        title: 'Plugins load failed',
                        info: 'The available plugins could not be loaded. ' +
                            'Please, try again in some minutes.',
                    }
                },
                controller: 'EpErrorController as vm',
                templateUrl: 'app/components/ep/epError.html',
                clickOutsideToClose: false
            });
        };

        $rootScope.$on('sePluginsLoadFail', function() {
            vm.loadingChart = false;
            vm.showPluginsFailed();
        });
    }
})();