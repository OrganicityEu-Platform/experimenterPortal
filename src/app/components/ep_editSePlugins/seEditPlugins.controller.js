(function() {
    'use strict';

    angular.module('app.components')
        .controller('SeEditPluginsController', SeEditPluginsController);

    SeEditPluginsController.$inject = ['EpDictionaries', '$state', '$stateParams',
        'DTOptionsBuilder', 'DTColumnDefBuilder', 'EpNewApp', 'EpApplications', 'alert'
    ];

    function SeEditPluginsController(EpDictionaries, $state, $stateParams,
        DTOptionsBuilder, DTColumnDefBuilder, EpNewApp, EpApplications, alert) {
        var vm = this;

        vm.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withLanguage({
                "sLengthMenu": "Show _MENU_ PLUGINS",
            })
            .withOption('lengthMenu', [5, 10, 20]);

        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0).notSortable(),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3).notSortable(),
            DTColumnDefBuilder.newColumnDef(4).notSortable()
        ];

        vm.plugins = angular.copy(EpDictionaries.getSePlugins());

        vm.pluginClick = function(plugin) {
            plugin.selected = (plugin.selected ? false : true);
        };

        vm.cancel = function() {
            $state.go('layout.ep.detail', { expId: $stateParams.expId });
        };

        vm.create = function() {

            var plugins = '';
            for (var i = 0; i < vm.plugins.length; i++) {
                if (vm.plugins[i].selected) {
                    if (plugins === '') {
                        plugins = vm.plugins[i].contextType;
                    } else {
                        plugins = plugins + ',' + vm.plugins[i].contextType;
                    }
                }
            }

            var more = EpNewApp.getMore();
            more.sensorDependencies = plugins;

            EpApplications.newApp($stateParams.expId, EpNewApp.getApp(),
                function() {
                    alert.success('Application created');
                    $state.go('layout.ep.detail', { expId: $stateParams.expId });
                },
                function() {
                    alert.error('Application creation failed');
                    $state.go('layout.ep.detail', { expId: $stateParams.expId });
                });
        };

        vm.addSensor = function() {
            console.log('Lets go to create a new sensor');
        };



    }
})();