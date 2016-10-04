(function() {
    'use strict';

    angular.module('app.components')
        .controller('CommunityController', CommunityController);


    CommunityController.$inject = ['$log', 'alert', 'DTOptionsBuilder', 'DTColumnDefBuilder', 
    'EpCommunity', 'EpExpInfo', '$state', 'loadInvitations'];

    function CommunityController($log, alert, DTOptionsBuilder, 
        DTColumnDefBuilder, EpCommunity, EpExpInfo, $state, loadInvitations) {
        var vm = this;
        vm.assets = [];
        vm.newInvitation = false;
        vm.invitationEmails = '';
        vm.expInfo = EpExpInfo.getNewExperiment();
        vm.invitations = EpCommunity.getInvitations()
        vm.message = '';

        vm.loadingChart = false;

        vm.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withLanguage({
                "sLengthMenu": "Show _MENU_ invitations",
            })
            .withOption('lengthMenu', [10, 20, 50]);

        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0).notSortable(),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2)
        ];

        vm.readableDate = function (str) {
            var date = new Date(str);
            return date.toString().substring(0, 15);;
            
        }

        if (loadInvitations.success === false) {
            vm.showErrorLoad = true;

        }

        vm.createInv = function () {
        	vm.newInvitation = true;
        }

        vm.send = function () {
            vm.loadingChart = true;
            EpCommunity.sendInvitations(vm.expInfo, vm.invitationEmails, vm.expInfo.description, 
                function (){
                    vm.loadingChart = false;
                    alert.success('Invitations sent');
                    $state.go($state.current, { onEdit: false }, { reload: true });
                },
                function(){
                    alert.error('Invitations could not be sent. Please, check that the emails addresses are correct.');
                    vm.loadingChart = false;
                });

            vm.invitationEmails = '';
            vm.message = '';
        	vm.newInvitation = false;	
        }

        vm.cancel = function () {
        	vm.newInvitation = false;	
        }
    }

})();