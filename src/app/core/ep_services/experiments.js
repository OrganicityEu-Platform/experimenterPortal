(function() {
    'use strict';


    angular.module('app.components')
        .factory('Experiments', ['Restangular', '$log', 'ExperimentsAPI', 'alert', Experiments]);

    function Experiments(Restangular, $log, ExperimentsAPI, alert) {

        var experiments = [];

        var service = {
            getExperiments: getExperiments,
            loadExperiments: loadExperiments,
            newExperiment: newExperiment,
            updateExperiment: updateExperiment,
            removeExperiment: removeExperiment,
            leaveExperiment: leaveExperiment,
        };

        return service;

        function getExperiments() {
            return experiments;
        }

        function loadExperiments(success_, fail_) {

            ExperimentsAPI.getExperiments(success, fail);

            function success(exps) {
                experiments = exps.experiments;
                success_();
            }

            function fail() {
                fail_();
            }
        }

        function newExperiment(info, success_, fail_) {
            ExperimentsAPI.newExperiment(info, success, fail);

            function success(res) {
                success_();
            }

            function fail() {
                fail_();
            }
        }

        function updateExperiment(info, success_, fail_) {
            ExperimentsAPI.updateExperiment(info.experimentId, info, success, fail);

            function success(exp) {
                for (var i = 0; i < experiments.length; i++) {
                    if (exp.experimentId === experiments[i].experimentId) {
                        experiments[i] = exp;
                    }
                }
                success_();
            }

            function fail() {
                fail_();
            }
        }

        function removeExperiment(id, success_, fail_) {
            ExperimentsAPI.removeExperiment(id, success, fail);

            function success() {
                for (var i = 0; i < experiments.length; i++) {
                    if (id === experiments[i].experimentId) {
                        experiments.splice(i, 1);
                    }
                }
                success_();
            }

            function fail() {
                fail_();
            }
        }

        function leaveExperiment(experId,  expId, success_, fail_) {
            ExperimentsAPI.leaveExperiment(experId,  expId, success, fail);

            function success() {
                for (var i = 0; i < experiments.length; i++) {
                    if (expId === experiments[i].experimentId) {
                        experiments.splice(i, 1);
                    }
                }
                success_();
            }
            function fail() {
                fail_();
            }
        }
    }

})();
