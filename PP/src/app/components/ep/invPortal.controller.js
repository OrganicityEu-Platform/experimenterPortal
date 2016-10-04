	(function() {
		'use strict';

		angular.module('app.components')
			.controller('InvPortalController', InvPortalController);

		InvPortalController.$inject = ['$log','EpCommunity', 'DTOptionsBuilder', 'DTColumnDefBuilder', '$mdDialog', 'alert'];


		function InvPortalController($log, EpCommunity, DTOptionsBuilder, DTColumnDefBuilder, $mdDialog, alert) {
			var vm = this; 
			vm.statusOpt = '';
			vm.invs = EpCommunity.getInvitations();
			vm.states = {};
            vm.loadingChart = false;

			for (var i = 0; i < vm.invs.length; i++) {
				vm.states[vm.invs[i].experimentId] = vm.invs[i].state;
			}



			console.log(JSON.stringify(vm.invs))

			vm.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withLanguage({
                "sLengthMenu": "Show _MENU_ invitations",
            })
            .withOption('lengthMenu', [10, 20, 50]);

        	vm.dtColumnDefs = [
            	DTColumnDefBuilder.newColumnDef(0),
            	DTColumnDefBuilder.newColumnDef(1),
            	DTColumnDefBuilder.newColumnDef(2),
            	DTColumnDefBuilder.newColumnDef(3).notSortable(),
            	DTColumnDefBuilder.newColumnDef(4),
            	DTColumnDefBuilder.newColumnDef(5).notSortable(),
            	DTColumnDefBuilder.newColumnDef(6).notSortable(),
        	];

        	vm.shortDescription = function(str) {
            return str.substr(0, 150) + '...';
        };	
        	vm.getDate = function (d) {
        		var date = new Date(d)
        		return date.toISOString().slice(0, 10);
        	}



        	vm.showInfo = function(inv) {
             $mdDialog.show({
                 locals: {
                     mdInfo: {
                         proceed: function() { $mdDialog.hide(); },
                         title: inv.name,
                         info: inv.description,
                     }
                 },
                controller: 'EpErrorController as vm',
                templateUrl: 'app/components/ep/epError.html',
                clickOutsideToClose: false
             });

         };

         vm.accept = function (inv) {
         	vm.states[inv.experimentId] = 'accepted';
         }

        vm.reject = function (inv) {
        	vm.states[inv.experimentId] = 'rejected';
        }

        vm.isAccepted = function (inv ){
        	return (vm.states[inv.experimentId] === 'accepted');	
        }
			
        vm.isRejected = function (inv ){
        	return (vm.states[inv.experimentId] === 'rejected');	
        }

        vm.update = function () {
        	var auxInvs = angular.copy(vm.invs);
            vm.loadingChart = true;
        	for (var i = 0; i < auxInvs.length; i++) {
        		auxInvs[i].state = vm.states[auxInvs[i].experimentId];
        	}

        	EpCommunity.updateInvitations (auxInvs, 
        		function () {
                    vm.loadingChart = false;
        			alert.success('Invitationes updated')
        			vm.invs = EpCommunity.getInvitations();
        		}, 
        		function () {
                    vm.loadingChart = false;
        			vm.invs = EpCommunity.getInvitations();
					alert.error('Invitationes could not be updates')
        		}
        	);
        }


		}
		
	})();
