(function() {
    'use strict';

    angular.module('app.components')
        .controller('SeEditPluginsController', SeEditPluginsController);

    SeEditPluginsController.$inject = ['Dictionaries', '$state', '$stateParams',
        'DTOptionsBuilder', 'DTColumnDefBuilder', 'NewApp', 'Applications', 'alert'
    ];

    function SeEditPluginsController(Dictionaries, $state, $stateParams,
        DTOptionsBuilder, DTColumnDefBuilder, NewApp, Applications, alert) {
        var vm = this;

        vm.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withDisplayLength(10)
            .withLanguage({
                "sLengthMenu": "Show _MENU_ PLUGINS",
            })
            .withOption('lengthMenu', [10, 20, 50]);

        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0).notSortable(),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3).notSortable(),
            DTColumnDefBuilder.newColumnDef(4).notSortable()
        ];

        vm.plugins = angular.copy(Dictionaries.getSePlugins());

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

            var more = NewApp.getMore();
            more.sensorDependencies = plugins;

            Applications.newApp($stateParams.expId, NewApp.getApp(),
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
        };



    }
})();