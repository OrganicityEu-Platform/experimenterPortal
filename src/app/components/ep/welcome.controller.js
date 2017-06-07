(function() {
    'use strict';

    angular.module('app.components')
        .controller('WelcomeController', WelcomeController);

    WelcomeController.$inject = ['$mdDialog', '$rootScope'];

    function WelcomeController($mdDialog, $rootScope) {
        var vm = this;
        

        vm.showInfo = function() {
            $mdDialog.show({
                locals: {
                    mdInfo: {
                        proceed: function() { $mdDialog.hide(); },
                        title: 'Experiments Load failed',
                        info: 'Your experiments could not be loaded or your rights do not allow experiments creation. ' +
                            'Note that only Organicity experimenters are allowed to make use of the Experimenter Portal. ' +
                            'If you are an experimenter, please contact Organicity managers',
                    }
                },
                controller: 'EpErrorController as vm',
                templateUrl: 'app/components/ep/epError.html',
                clickOutsideToClose: false
            });

        };
        $rootScope.$on('experimentsFail', function() {
            vm.showInfo();
        });
    }
})();