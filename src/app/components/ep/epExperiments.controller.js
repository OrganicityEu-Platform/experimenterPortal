(function() {
    'use strict';

    angular.module('app.components')
        .controller('EpExperimentsController', EpExperimentsController);

    EpExperimentsController.$inject = ['$state', '$mdDialog', 'alert', 'Experiments',
        'DTOptionsBuilder', 'DTColumnDefBuilder', '$rootScope','load', 'auth'];

    function EpExperimentsController($state, $mdDialog, alert, Experiments,
        DTOptionsBuilder, DTColumnDefBuilder, $rootScope, load, auth) {
        var vm = this;
        vm.loadingChart = false;

        if(load.success === false) {
            auth.logout();
        }

        vm.currentExperimenterId = auth.getCurrentUserid();

        vm.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withLanguage({
                "sLengthMenu": "Show _MENU_ experiments",
            })
            .withOption('lengthMenu', [10, 20, 50]);

        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0).notSortable(),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2).notSortable(),
            DTColumnDefBuilder.newColumnDef(3).notSortable(),
            DTColumnDefBuilder.newColumnDef(4).notSortable(),
            DTColumnDefBuilder.newColumnDef(5).notSortable(),
            DTColumnDefBuilder.newColumnDef(6).notSortable()
        ];

        function leaveHtml(data, type, full, meta) {
            return '<i style="cursor:pointer" class="material-icons">clear</i>';
        }

        function deleteHtml(data, type, full, meta) {
            return '<i style="cursor:pointer" class="material-icons">delete</i>';
        }

        vm.showInfo = function() {
            $mdDialog.show({
                locals: {
                    mdInfo: {
                        proceed: function() { $mdDialog.hide(); },
                        title: 'Experiments Load failed',
                        info: 'The experiment information could not be loaded',
                    }
                },
                controller: 'EpErrorController as vm',
                templateUrl: 'app/components/ep/epError.html',
                clickOutsideToClose: false
            });

        };

        $rootScope.$on('experimentInfoFail', function() {
            vm.loadingChart = false;
            vm.showInfo();
        });

        vm.experiments = Experiments.getExperiments();

        vm.experimentId = "";

        vm.detail = function(exp) {
            vm.loadingChart = true;
            $state.go('layout.ep.detail', { expId: exp.experimentId });
        };

        vm.ShortDescription = function(str) {
            return str.substr(0, 150) + '...';
        };

        vm.ChangeStatus = function(exp) {
            var experiment = angular.copy(exp);
            vm.loadingChart = true;
            vm.experimentId = experiment.experimentId;
            var today = new Date();
            var start = new Date(experiment.startDate);
            var finish = new Date(experiment.endDate);

            if (start < today && today < finish) {
                var newStatus = '';
                if (experiment.status === 'stopped') {
                    newStatus = 'running';
                } else {
                    newStatus = 'stopped';
                }
                experiment.status = newStatus;
                Experiments.updateExperiment(experiment, ChangeStatusSuccess, ChangeStatusError);
            } else {
                vm.loadingChart = false;
                alert.error('The experiment cannot be trigger. Please check the experiment dates.');
            }
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


        vm.NewExperiment = function() {
            $state.go('layout.ep.newExpInfo.info');
        };

        vm.confirmRemove = function(ev, exp) {
            vm.experimentId = exp.experimentId;
            $mdDialog.show({
                locals: {
                    mdInfo: {
                        cancel: function() { $mdDialog.hide(); },
                        proceed: vm.remove,
                        title: 'You are removing an experiment',
                        info: 'By doing so all the information related to the experiment ' +
                            'will be lost. This will also disable your applications developed ' +
                            'under the experiment',
                        question: 'Do you want to continue?'
                    }
                },
                controller: 'EpConfirmController as vm',
                templateUrl: 'app/components/ep/epConfirm.html',
                clickOutsideToClose: false
            });
        };

        vm.confirmLeave = function(ev, exp) {
            vm.experimentId = exp.experimentId;
            $mdDialog.show({
                locals: {
                    mdInfo: {
                        cancel: function() { $mdDialog.hide(); },
                        proceed: vm.leave,
                        title: 'You are leaving an experiment',
                        info: 'By doing so you will not have access to the experiment anymore',
                        question: 'Do you want to continue?'
                    }
                },
                controller: 'EpConfirmController as vm',
                templateUrl: 'app/components/ep/epConfirm.html',
                clickOutsideToClose: false
            });
        };

        vm.remove = function() {
            $mdDialog.hide();
            vm.loadingChart = true;
            Experiments.removeExperiment(vm.experimentId, RemovalSuccess, RemovalError);
        };

        vm.leave = function() {
            $mdDialog.hide();
            vm.loadingChart = true;
            Experiments.leaveExperiment(vm.currentExperimenterId, vm.experimentId, LeaveSuccess, LeaveError);
        };

        function RemovalSuccess() {
            vm.loadingChart = false;
            alert.success('Experiments have been removed');
            vm.experiments = Experiments.getExperiments();
            vm.experimentId = "";
        }

        function RemovalError() {
            vm.loadingChart = false;
            alert.error('Experiments removal was not correctly performed');
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