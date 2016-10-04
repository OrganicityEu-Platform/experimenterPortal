(function() {
    'use strict';

    angular.module('app.components')
        .controller('EpLayoutController', EpLayoutController);

    EpLayoutController.$inject = ['$state', 'EpDictionaries', 'loadTools', '$window'];

    function EpLayoutController($state, EpDictionaries, loadTools, $window) {
        var vm = this;
        vm.docref = 'https://organicityeu.github.io/api/';
        vm.github = 'https://github.com/OrganicityEu/';
        vm.zoho = 'https://support.zoho.com/portal/organicity/home';
        vm.googlegroups = 'https://groups.google.com/forum/#!forum/organicity-experimentation';

        vm.toExperiments = function() {
            $state.go('layout.ep.exps');
        };

        vm.callHref = function (ref) {
            $window.open(ref, '_blank');
        }



        if (loadTools.success === false) {
        } else {
        }

        vm.tools = EpDictionaries.getTools();
    }
})();