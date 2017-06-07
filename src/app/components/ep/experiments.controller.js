(function() {
    'use strict';

    angular.module('app.components').controller('ExperimentsController', ExperimentsController);

    ExperimentsController.$inject = [
        '$state',
        'alert',
        'Experiments',
        'DTOptionsBuilder',
        'DTColumnDefBuilder',
        'auth',
        '$mdDialog',
        'NewExperiment'
    ];

    function ExperimentsController(
        $state, 
        alert, 
        Experiments, 
        DTOptionsBuilder, 
        DTColumnDefBuilder, 
        auth, 
        $mdDialog,
        NewExperiment
    ) {
        var vm = this;
        vm.loadingChart = false;

        vm.currentExperimenterId = auth.getCurrentUserid();

        vm.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withDisplayLength(5)
            .withLanguage({
                "sLengthMenu": "Show _MENU_ experiments",
            })
            .withOption('lengthMenu', [5, 10, 20]);

        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0).notSortable(),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2).notSortable(),
            DTColumnDefBuilder.newColumnDef(3).notSortable(),
            DTColumnDefBuilder.newColumnDef(4).notSortable(),
            DTColumnDefBuilder.newColumnDef(5).notSortable()
        ];

        function leaveHtml(data, type, full, meta) {
            return '<i style="cursor:pointer" class="material-icons">clear</i>';
        }

        function deleteHtml(data, type, full, meta) {
            return '<i style="cursor:pointer" class="material-icons">delete</i>';
        }


        vm.experiments = Experiments.getExperiments();

        vm.experimentId = "";

        vm.detail = function(exp) {
            vm.loadingChart = true;
            $state.go('layout.detail', { expId: exp.experimentId });
        };

        vm.ShortDescription = function(str) {
            return str.substr(0, 150) + '...';
        };

        vm.ChangeStatus = function(exp) {
            var experiment = angular.copy(exp);
            vm.loadingChart = true;
            vm.experimentId = experiment.experimentId;
            var newStatus;
            if (experiment.status === 'stopped') {
                newStatus = 'running';
            } else {
                newStatus = 'stopped';
            }
            experiment.status = newStatus;
            Experiments.updateExperiment(experiment, ChangeStatusSuccess, ChangeStatusError);
        };

        function ChangeStatusSuccess() {
            vm.experiments = Experiments.getExperiments();
            vm.experimentId = "";
            vm.loadingChart = false;
        }

        function ChangeStatusError() {
            vm.experimentId = "";
            vm.loadingChart = false;
            alert.error('The experiment status cannot be modified');
        }


        vm.NewExperimentCall = function() {
            vm.loadingChart = true;
            NewExperiment.flush();
            $state.go('layout.newExpInfo.info');
        };


        vm.confirmRemove = function(ev, exp) {
            vm.experimentId = exp.experimentId;
            var confirm = $mdDialog.confirm()
            .title('Do you want to remove this experiment?')
            .textContent('By doing so all the information related to the experiment \n' +
                             'will be lost. This will also disable your applications developed \n' +
                             'under the experiment')
            .ariaLabel('')
            .targetEvent(ev)
            .ok('Continue')
            .cancel('No, thanks')
            .clickOutsideToClose(true)
            .fullscreen(true);
            $mdDialog.show(confirm).then(vm.remove, function() {});
        };

         vm.confirmLeave = function(ev, exp) {
            vm.experimentId = exp.experimentId;
            var confirm = $mdDialog.confirm()
            .title('Do you want to leave this experiment?')
            .textContent('By doing so you will not have access to the experiment anymore')
            .ariaLabel('')
            .targetEvent(ev)
            .ok('Continue')
            .cancel('No, thanks')
            .clickOutsideToClose(true)
            .fullscreen(true);
            $mdDialog.show(confirm).then(vm.leave, function() {});            
        };


        vm.remove = function() {
            vm.loadingChart = true;
            Experiments.removeExperiment(vm.experimentId, RemovalSuccess, RemovalError);
        };

        vm.leave = function() {
            vm.loadingChart = true;
            Experiments.leaveExperiment(vm.currentExperimenterId, vm.experimentId, LeaveSuccess, LeaveError);
        };

        function RemovalSuccess() {
            vm.loadingChart = false;
            alert.success('Experiment successfully removed');
            vm.experiments = Experiments.getExperiments();
            vm.experimentId = "";
        }

        function RemovalError() {
            vm.loadingChart = false;
            alert.error('Experiment could not be removed');
            vm.experiments = Experiments.getExperiments();
            vm.experimentId = "";
        }


        function LeaveSuccess() {
            vm.loadingChart = false;
            vm.experiments = Experiments.getExperiments();
            vm.experimentId = "";
        }

        function LeaveError() {
            vm.loadingChart = false;
            vm.experiments = Experiments.getExperiments();
            vm.experimentId = "";
        }

        vm.getIcon = function(exp) {
            var icon = 'assets/ep/exp-default.svg';
            if (typeof exp.logo !== undefined && exp.logo !== null &&
                exp.logo !== '') {
                icon = exp.logo;
            }
            return icon;
        };
    }
})();