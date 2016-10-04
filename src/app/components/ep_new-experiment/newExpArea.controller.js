(function() {
    'use strict';

    angular.module('app.components')
        .controller('EpNewExperAreaController', EpNewExperAreaController);

    EpNewExperAreaController.$inject = ['leafletData', '$scope',
        'alert', 'DTOptionsBuilder', 'DTColumnDefBuilder',
        '$location', 'Experiments', '$timeout', 'EpNewExperiment', '$window', '$mdDialog'
    ];

    function EpNewExperAreaController(leafletData, $scope, alert,
        DTOptionsBuilder, DTColumnDefBuilder, $location, Experiments, $timeout, EpNewExperiment, $window, $mdDialog) {
        var vm = this;

        vm.infoAdvance = false;

        vm.browser = null;
        var userAgent = $window.navigator.userAgent;
        var browsers = {chrome: /chrome/i, safari: /safari/i, firefox: /firefox/i, ie: /internet explorer/i};
        for(var key in browsers) {
            if (browsers[key].test(userAgent)) {
                vm.browser = key;
            }
        };

        vm.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withDisplayLength(2);

        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4),
            DTColumnDefBuilder.newColumnDef(5),
            DTColumnDefBuilder.newColumnDef(6).notSortable().renderWith(deleteHtml)
        ];



        function deleteHtml(data, type, full, meta) {
            return '<button>' +
                '<i class="material-icons">delete</i>' +
                '</button>';
        }

        vm.remove = function(ev, item) {
            var index = vm.regions.indexOf(item);
            if (index > -1) {
                vm.regions.splice(index, 1);
            }
        };

        vm.creatingRegion = false;

        vm.regions = [];

        vm.expStart = EpNewExperiment.getExperiment().startDate;
        vm.expEnd = EpNewExperiment.getExperiment().endDate;

        vm.createNewRegion = function ()  {
            vm.creatingRegion = true;
        };        

        vm.newRegion = {
            startDate: vm.expStart,
            endDate: vm.expEnd,
            coordinates: []
        };


        var baseMaps = {
            mapbox_light: {
                name: 'Experimenter Portal',
                url: 'https://api.mapbox.com/styles/v1/ldiez/cip566f5r000adqnijje4slry/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGRpZXoiLCJhIjoiY2lwNTV4YWdyMDAwbnc3a3NjYmk4ZGgzeCJ9.IOrZBfy-7mTmm2ANc88SoQ',
                type: 'xyz',
                layerParams: {
                    showOnSelector: false
                }
            }
        };

        var polygonStyle = {
            shapeOptions: {
                color: 'black',
                stroke: false,
                weight: 2,
                opacity: 0.5,
                fill: true,
                fillColor: 'black', //same as color by default
                fillOpacity: 0.2,
                clickable: true
            },
        };

        var drawnItems = new L.FeatureGroup();

        var options = {

            edit: {
                featureGroup: drawnItems
            },
            draw: {
                polyline: false,
                marker: false,
                rectangle: false,
                polygon: polygonStyle,
                circle: false,
            },
            showRadius: true
        };


        var drawControl = new L.Control.Draw(options);

        angular.extend($scope, {
            controls: {
                custom: [drawControl]
            },
            layers: {
                baselayers: baseMaps,
            },
            center: {
                lat: 45.583289756006316,
                lng: 0.6591796875,
                zoom: 4
            }
        });

        leafletData.getMap('regionCreation').then(function(map) {
            map.addLayer(drawnItems);

            $timeout(function() {});

            map.on('draw:created', function(e) {
                var type = e.layerType,
                    layer = e.layer;
                if (type === 'polygon') {
                    if (drawnItems.getLayers().length === 0) {
                        drawnItems.addLayer(layer);
                        map.fitBounds(drawnItems.getBounds());
                        var shape = layer.toGeoJSON();
                        vm.newRegion.coordinates = shape.geometry.coordinates[0];
                    } else {
                        alert.error('A region consists of just one polygon');
                    }
                }
            });

        });


        vm.addRegion = function() {
            vm.regions.push(vm.newRegion);
            vm.newRegion = {
                startDate: vm.expStart,
                endDate: vm.expStart,
                coordinates: []
            };

            drawnItems.clearLayers();
            vm.newRegionForm.$setPristine();
            vm.creatingRegion = false;
        };

        vm.cancelAddRegion = function () {
            vm.newRegion = {
                startDate: vm.expStart,
                endDate: vm.expStart,
                coordinates: []
            };

            drawnItems.clearLayers();
            vm.newRegionForm.$setPristine();
            vm.creatingRegion = false;
        }

        vm.cancel = function() {
            $location.path('/experiments');
        };

        vm.finish = function() {
            EpNewExperiment.setRegions(vm.regions);
            Experiments.newExperiment(
                EpNewExperiment.getExperiment(),
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


         vm.showInfo = function() {
             $mdDialog.show({
                 locals: {
                     mdInfo: {
                         proceed: function() { $mdDialog.hide(); },
                         title: 'You are defining the area of the experiment',
                         info: 'You can define the area of the experiment by creating \
                         regions in which the experiment will take place. If you do not define \
                            any area, the experiment will be considered world-wide.',
                     }
                 },
                controller: 'EpErrorController as vm',
                templateUrl: 'app/components/ep/epError.html',
                clickOutsideToClose: false
             });

         };


         vm.showInfoAdvance = function () {
            vm.infoAdvance = vm.infoAdvance ? false : true;
         }




    }
})();