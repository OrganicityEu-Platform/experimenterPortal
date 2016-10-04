(function() {
    'use strict';

    angular.module('app.components')
        .controller('SeModifyPluginsController', SeModifyPluginsController);

    SeModifyPluginsController.$inject = ['EpDictionaries', '$state',
        'DTOptionsBuilder', 'DTColumnDefBuilder', 'AppInfo', 'EpExpInfo'
    ];

    function SeModifyPluginsController(EpDictionaries, $state,
        DTOptionsBuilder, DTColumnDefBuilder, AppInfo, EpExpInfo) {
        var vm = this;

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
            $state.go('layout.ep.appInfo', {
                expId: EpExpInfo.getExperiment().experimentId,
                appId: AppInfo.getApp().applicationId,
                onEdit: true
            })
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
                expId: EpExpInfo.getExperiment().experimentId,
                appId: AppInfo.getApp().applicationId,
                onEdit: true
            })
        };

    }
})();