(function() {
    'use strict';

    angular.module('app.components')
        .controller('NewExpInfoController', NewExpInfoController);

    NewExpInfoController.$inject = [
    'NewExperiment', 
    '$location', 
    '$window', 
    '$mdDialog',
    'Experiments',
    'alert',
    '$state'
    ];

    function NewExpInfoController(
        NewExperiment, 
        $location, 
        $window, 
        $mdDialog, 
        Experiments,
        alert,
        $state
    ) {
        var vm = this;
        vm.loadingChart = false;
        vm.assetsPublic = false;
        init ();

        function  init () {
            var newExp = NewExperiment.getExperiment ();
            vm.name = newExp.name;
            vm.description = newExp.description;
            vm.assetsPublic = newExp.assetsPublic;
        }

        vm.defineArea = function() {
            NewExperiment.setName(vm.name);
            NewExperiment.setDescription(vm.description);
            NewExperiment.setAssetsPublic(vm.assetsPublic);
            $location.path('/new-experiment/area');
        };

        vm.continue = function() {
            vm.loadingChart = true;
            NewExperiment.setName(vm.name);
            NewExperiment.setDescription(vm.description);
            NewExperiment.setAssetsPublic(vm.assetsPublic);
            Experiments.newExperiment(
                NewExperiment.getExperiment(),
                creationSuccess,
                creationError
            );
        };

        function creationSuccess() {
            alert.success('Experiment Created');
            $location.path('/experiments');
        }

        function creationError() {
            alert.error('Error creating the experiment');
            $location.path('/experiments');
        }

        vm.cancel = function() {
            vm.loadingChart = true;
            $location.path('/experiments');
        };

        vm.infoAssets = false;
        vm.infoArea = false;

        vm.showInfoAssets = function () {
            vm.infoAssets = vm.infoAssets ? false : true;
        };

        vm.showInfoArea = function () {
            vm.infoArea = vm.infoArea ? false : true;
        };

        vm.goHome = function (){
            $state.go('layout.exps');
        };
     }
})();
