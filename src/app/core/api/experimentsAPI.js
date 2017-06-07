(function() {
    'use strict';

    angular.module('app.components').factory('ExperimentsAPI', [
        '$http',
        'Restangular',
        ExperimentsAPI
    ]);


    function ExperimentsAPI(
        $http,
        Restangular
    ) {
        var service = {
            getExperiments: getExperiments,
            newExperiment: newExperiment,
            getExperiment: getExperiment,
            updateExperiment: updateExperiment,
            removeExperiment: removeExperiment,
            addExperimenter: addExperimenter,
            sendInvitations: sendInvitations,
            getInvitations: getInvitations,
            getParInvitations: getParInvitations,
            updateInvitations: updateInvitations,
            leaveExperiment: leaveExperiment
        };

        return service;

        function getExperiments(success_, fail_) {
            var path = 'experiments';
            Restangular.one(path).get().then(
                function(res) {
                    return success_(res.plain());
                },
                function() {
                    return fail_();
                });

        }

        function newExperiment(info, success_, fail_) {
            var path = 'experiments/';
            Restangular.one(path).customPOST(info).then(
                function() {
                    return success_();
                },
                function() {
                    return fail_();
                });
        }

        function getExperiment(id, success_, fail_) {
            var path = 'experiments/' + id;
            Restangular.one(path).get().then(
                function(res) {
                    return success_(res.plain());
                },
                function() {
                    return fail_();
                });
        }

        function updateExperiment(id, info, success_, fail_) {
            var path = 'experiments/' + id;
            Restangular.one(path).customPUT(info).then(
                function(res) {
                    return success_(res);
                },
                function() {
                    return fail_();
                });
        }

        function removeExperiment(id, success_, fail_) {
            var path = 'experiments/' + id;
            Restangular.one(path).remove().then(
                function(res) {
                    return success_();
                },
                function(res) {
                    return fail_();
                });
        }

        function addExperimenter(id, email, success_, fail_) {
            var path = 'experiments/addexperimenter/' + id + '/' + email;
            Restangular.one(path).customPOST().then(
                function() {
                    return success_();
                },
                function() {
                    return fail_();
                });
        }

        function sendInvitations(exp, emails, message, success_, fail_) {
            var path = 'invitations/' + exp.experimentId;
            Restangular.one(path).customPOST({
                emails: emails,
                message: message,
                description: exp.description,
                name: exp.name
            }).then(
                function() {
                    return success_();
                },
                function() {
                    return fail_();
                });
        }

        function getInvitations(id, success_, fail_) {
            var path = 'invitations/' + id;
            Restangular.one(path).get().then(
                function(res) {
                    return success_(res.plain());
                },
                function() {
                    return fail_();
                });
        }

        function getParInvitations(success_, fail_) {
            var path = 'par-invitations';
            Restangular.one(path).get().then(
                function(res) {
                    return success_(res.plain());
                },
                function() {
                    return fail_();
                });
        }

        function updateInvitations(invs, success_, fail_) {
            var path = 'par-invitations';
            Restangular.one(path).customPUT(invs).then(
                function() {
                    success_();
                },
                function() {
                    fail_();
                });
        }

        function leaveExperiment(experId, expId, success_, fail_) {

            var path = 'experiments/removeexperimenter/' + expId + '/' + experId;
            Restangular.one(path).customPOST().then(
                function() {
                    return success_();
                },
                function() {
                    return fail_();
                });
        }
    }
})();
