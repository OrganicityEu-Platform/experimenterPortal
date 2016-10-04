(function() {
    'use strict';

    angular.module('app.components')
        .controller('EpExperimentInfoController', EpExperimentInfoController);

    EpExperimentInfoController.$inject = ['alert', '$state', '$timeout', 'leafletData', 'EpExpInfo', 
    '$mdDialog', '$rootScope', 'loadExpDomains', 'auth', '$window'
    ];

    function EpExperimentInfoController(alert, $state, $timeout, leafletData, EpExpInfo,
        $mdDialog, $rootScope, loadExpDomains, auth, $window) {
        var vm = this;
        vm.tagsEditing = true;
        vm.showToken = false;
        vm.newExper = false;
        vm.newExperimenter = "";
        vm.token = auth.getToken();
        vm.browser = null;
        var userAgent = $window.navigator.userAgent;
        var browsers = {chrome: /chrome/i, safari: /safari/i, firefox: /firefox/i, ie: /internet explorer/i};
        for(var key in browsers) {
            if (browsers[key].test(userAgent)) {
                vm.browser = key;
            }
        };



        vm.experimentInfo = EpExpInfo.getNewExperiment();
        vm.clientInfo = vm.experimentInfo.clientInfo || {};
        vm.mainExperimenterId = EpExpInfo.getMainExperimenter();
        vm.currentExperimenterId = auth.getCurrentUserid();
        vm.domains = EpExpInfo.getDomains();
        vm.loadingChart = false;

        var date = new Date(vm.experimentInfo.registered);
        vm.registrationTime = date.toString();
        vm.drawnItems = new L.FeatureGroup();

        vm.addExper = function () {
            vm.loadingChart = true;
            EpExpInfo.addExperimenter(vm.experimentInfo.experimentId, vm.newExperimenter,
                function(){
                    vm.loadingChart = false;
                    alert.success('Experimenter ' + vm.newExperimenter + ' added');
                },
                function(){
                    vm.loadingChart = false;
                    alert.error('Experimenter ' + vm.newExperimenter + ' could not be added');
                });
            vm.newExper = false;
            vm.newExperimenter = "";
        }

        vm.addExperCancel = function () {
                  vm.newExper = false;
            vm.newExperimenter = "";
        }

        vm.showInfoDomainsFailed = function() {
            $mdDialog.show({
                locals: {
                    mdInfo: {
                        proceed: function() { $mdDialog.hide(); },
                        title: 'Tags Load failed',
                        info: 'Organicity tags could not be loaded, so that experiment tags editing has been disable.',
                    }
                },
                controller: 'EpErrorController as vm',
                templateUrl: 'app/components/ep/epError.html',
                clickOutsideToClose: false
            });

        };

        if (loadExpDomains.success === false) {
            vm.tagsEditing = false;
            //vm.showInfoDomainsFailed();
        }

        


        $rootScope.$on('allTagDomainsInfoFail', function() {
            vm.loadingChart = false;
            vm.tagsEditing = false;
            vm.showInfoDomainsFailed();
        });

        vm.currentInfo = {
            experimentId: vm.experimentInfo.experimentId,
            name: vm.experimentInfo.name,
            description: vm.experimentInfo.description,
            assetsPublic: vm.experimentInfo.assetsPublic,
            startDate: new Date(vm.experimentInfo.startDate),
            endDate: new Date(vm.experimentInfo.endDate),
            area: vm.experimentInfo.area || []
        };

        vm.somethingChanged = function () {
            if (EpExpInfo.areaModified()) {
                return true;
            }
            if (EpExpInfo.domainsModified()) {
                return true;
            }

           
            return false;

        }


        vm.allDomains = true;
        vm.domainsLimit = 5;
        vm.domainsCtrl = {
            showMore: false,
            showLess: false
        };

        vm.showAllDomains = function() {
            if (vm.allDomains) {
                vm.domainsCtrl.showMore = false;
                vm.domainsCtrl.showLess = true;
                vm.allDomains = false;
                return;
            }
            vm.domainsCtrl.showMore = true;
            vm.domainsCtrl.showLess = false;
            vm.allDomains = true;
            return;
        };

        vm.icon = 'assets/ep/exp-default.svg';

        initialize();

        vm.loadLayers = function(feature, layer) {
            vm.drawnItems.addLayer(layer);
        };

        function initialize() {
            if (typeof vm.experimentInfo.logo !== undefined && vm.experimentInfo.logo !== null &&
                vm.experimentInfo.logo !== '') {
                vm.icon = vm.experimentInfo.logo || 'assets/ep/exp-default.svg';
            }

            if (vm.domains.length > vm.domainsLimit) {
                vm.domainsCtrl.showMore = true;
            }

            $timeout(function() {
                vm.drawnItems.clearLayers();
                leafletData.getMap('mapPreview').then(function(map) {
                    map.invalidateSize();
                    map.doubleClickZoom.disable();
                    map.scrollWheelZoom.disable();
                    map.dragging.disable();
                    map.removeControl(map.zoomControl);
                    map.addLayer(vm.drawnItems);

                    for (var i = 0; i < vm.currentInfo.area.length; i++) {
                        var selectedArea = {
                            "type": "Feature",
                            "properties": {},
                            "geometry": {
                                "type": "Polygon",
                                "coordinates": [vm.currentInfo.area[i].coordinates]
                            }
                        };

                        L.geoJson(selectedArea, {
                            onEachFeature: vm.loadLayers
                        }).addTo(map);
                    }


                    if (vm.drawnItems.getLayers().length > 0) {
                        map.fitBounds(vm.drawnItems.getBounds());
                    }

                });
            }, 500);
        }

        vm.UpdateExperiment = function() {

            EpExpInfo.setNewName(vm.currentInfo.name);
            EpExpInfo.setNewDescription(vm.currentInfo.description);
            EpExpInfo.setNewStart(vm.currentInfo.startDate);
            EpExpInfo.setNewEnd(vm.currentInfo.endDate);
            EpExpInfo.setAssetsPublic(vm.currentInfo.assetsPublic);


            var today = new Date();
            var start = new Date(vm.currentInfo.startDate);
            var finish = new Date(vm.currentInfo.endDate);

            if (start < today || today < finish) {
                EpExpInfo.setNewStatus ('stopped');
            }

            EpExpInfo.update(function() {
                EpExpInfo.updateDomains(successUpdate, errorUpdate);
            }, errorUpdate);
            vm.loadingChart = true;
        };

        function successUpdate() {
            alert.success('Experiment successfully updated');
            vm.loadingChart = false;
            $state.go($state.current, { onEdit: false }, { reload: true });
        }

        function errorUpdate() {
            vm.loadingChart = false;
            EpExpInfo.reset();

            alert.error('The experiment could not be updated. Try it later');
            $state.go($state.current, { onEdit: false }, { reload: true });
        }

        vm.reset = function() {
            EpExpInfo.reset();
            $state.go($state.current, { onEdit: false }, { reload: true });
        };

        vm.updateArea = function() {
            vm.loadingChart = true;
            $state.go('layout.ep.expEdition.area', { expId: vm.experimentInfo.experimentId });
        };

        vm.updateTags = function() {
            if (vm.tagsEditing === false) {
                return;
            }
            vm.loadingChart = true;
            $state.go('layout.ep.expEdition.tags', { expId: vm.experimentInfo.experimentId });
        };

        vm.submit = function(fileData) {
            EpExpInfo.uploadIcon(vm.experimentInfo.experimentId, fileData[0],
                function() {
                    vm.loadingChart = false;
                    $state.reload();
                    //$state.go($state.current, { onEdit: false }, { reload: true, inherit: false, notify: true });
                },
                function() {
                    vm.loadingChart = false;
                });

        };





    }
})();