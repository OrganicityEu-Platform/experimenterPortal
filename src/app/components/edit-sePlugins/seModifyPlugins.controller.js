(function() {
    'use strict';

    angular.module('app.components')
        .controller('SeModifyPluginsController', SeModifyPluginsController);

    SeModifyPluginsController.$inject = ['Dictionaries', '$state', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'AppInfo', 'ExpInfo'];

    function SeModifyPluginsController(Dictionaries, $state, DTOptionsBuilder, DTColumnDefBuilder, AppInfo, ExpInfo) {
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
            $state.go('layout.ep.appInfo', {
                expId: ExpInfo.getExperiment().experimentId,
                appId: AppInfo.getApp().applicationId,
                onEdit: true
            });
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

            var more = AppInfo.setNewSePlugins(plugins);
            $state.go('layout.ep.appInfo', {
                expId: ExpInfo.getExperiment().experimentId,
                appId: AppInfo.getApp().applicationId,
                onEdit: true
            });
        };

    }
})();