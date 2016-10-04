(function() {
    'use strict';

    angular.module('app.components')
        .factory('EpCommunity', ['$log', 'ExperimentsAPI', EpCommunity]);


    function EpCommunity($log, ExperimentsAPI) {

        var invitations = null;

        var service = {
            flush: flush,
            sendInvitations: sendInvitations,
            loadInvitations: loadInvitations,
            getInvitations: getInvitations,
            loadParInvitations: loadParInvitations,
            updateInvitations: updateInvitations
        };

        return service;

        function flush() 
        {
            invitations = null;
        }

        function sendInvitations (exp, emails, message, success_, fail_) 
        {
            ExperimentsAPI.sendInvitations(exp, emails, message, success_, fail_);   
        }

        function loadInvitations (id, success_, fail_) 
        {
            ExperimentsAPI.getInvitations(id, 
            function (res){
                invitations = res.invitations;
                return success_();

            }, function (){
                return fail_();
            });   
        }
        
        function getInvitations ()
        {
            return (invitations !== null ? invitations : []);
        }

        function loadParInvitations (success_, fail_) {
            ExperimentsAPI.getParInvitations(function (ret) {
                invitations = ret;

                console.log(invitations)
                success_();
            }, fail_);
        }

        function updateInvitations (invs, success_, fail_) {
            ExperimentsAPI.updateInvitations(invs, function() {
                invitations = invs;
                success_();
            }, fail_)
        }


    }
})();