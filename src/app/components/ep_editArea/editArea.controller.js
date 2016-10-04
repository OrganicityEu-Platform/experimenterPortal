(function() {
    'use strict';

    angular.module('app.components')
        .controller('EditAreaController', EditAreaController);

    EditAreaController.$inject = ['leafletData', '$scope',
        'alert', 'EpNewExperiment', 'DTOptionsBuilder', 'DTColumnDefBuilder',
        '$state', '$timeout', 'EpExpInfo', '$window'
    ];

    function EditAreaController(leafletData, $scope, alert,
        EpNewExperiment, DTOptionsBuilder, DTColumnDefBuilder, $state,
        $timeout, EpExpInfo, $window) {
        var vm = this;

        vm.browser = null;
        var userAgent = $window.navigator.userAgent;
        var browsers = {chrome: /chrome/i, safari: /safari/i, firefox: /firefox/i, ie: /internet explorer/i};
        for(var key in browsers) {
            if (browsers[key].test(userAgent)) {
                vm.browser = key;
            }
        };

        vm.isNew = false;
        vm.showMap = false;
        vm.infoAdvance = false;

        vm.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withDisplayLength(2)
            .withLanguage({
                "sLengthMenu": "Show _MENU_ regions",
            })
            .withOption('lengthMenu', [2, 5, 10, 50]);


        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4),
            DTColumnDefBuilder.newColumnDef(5),
            DTColumnDefBuilder.newColumnDef(6).notSortable().renderWith(deleteHtml),
            DTColumnDefBuilder.newColumnDef(7).notSortable().renderWith(detailHtml)
        ];

        function detailHtml(data, type, full, meta) {
            return '<i style="cursor:pointer" class="material-icons">zoom_out_map</i>';
        }

        function deleteHtml(data, type, full, meta) {
            return '<i style="cursor:pointer" class="material-icons">delete</i>';
        }


        vm.remove = function(ev, item) {
            var index = vm.regions.indexOf(item);
            if (index > -1) {
                vm.regions.splice(index, 1);
            }
        };

        vm.detail = function(region) {
            vm.showMap = true;
            vm.drawnItems.clearLayers();
            vm.newRegionForm.$setPristine();
            vm.currRegion = region;
            vm.currRegion.startDate = new Date(vm.currRegion.startDate);
            vm.currRegion.endDate = new Date(vm.currRegion.endDate);
            var selectedArea = {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [vm.currRegion.coordinates]
                }
            };

            L.geoJson(selectedArea, {
                onEachFeature: function(feature, layer) {
                    vm.drawnItems.addLayer(layer);
                },
            });
            vm.map.fitBounds(vm.drawnItems.getBounds());
        };

        vm.regions = EpExpInfo.getExperiment().area || [];
        vm.currRegion = null;
        vm.newRegion = null;


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

        vm.drawnItems = new L.FeatureGroup();

        var options = {

            edit: {
                featureGroup: vm.drawnItems
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

        vm.center = {
            lat: 45.583289756006316,
            lng: 0.6591796875,
            zoom: 4
        };
        angular.extend($scope, {
            controls: {
                custom: [drawControl]
            },
            layers: {
                baselayers: baseMaps,
            },
            center: vm.center
        });

        vm.map = null;
        init();

        function init() {
            $timeout(function() {
                leafletData.getMap('regionEdition').then(function(map) {
                    vm.map = map;
                    map.addLayer(vm.drawnItems);

                    map.on('draw:created', function(e) {
                        var layer = e.layer;
                        if (vm.drawnItems.getLayers().length === 0) {
                            vm.drawnItems.addLayer(layer);
                            map.fitBounds(vm.drawnItems.getBounds());
                            var shape = layer.toGeoJSON();
                            if (vm.isNew) {
                                vm.newRegion.coordinates = shape.geometry.coordinates[0];
                            }
                        } else {
                            alert.error('A region consists of just one polygon');
                        }

                    });
                    map.on('draw:edited', function(e) {
                        var layers = e.layers;
                        layers.eachLayer(function(layer) {
                            var shape = layer.toGeoJSON();
                            if (!vm.isNew) {
                                vm.currRegion.coordinates = shape.geometry.coordinates[0];
                            }
                        });
                        map.fitBounds(vm.drawnItems.getBounds());
                    });
                });
            }, 500);
        }


        vm.cancel = function() {
            $state.go('layout.ep.detail', { expId: EpExpInfo.getExperiment().experimentId });
        };

        vm.done = function() {
            EpExpInfo.setNewRegions(vm.regions);
            $state.go('layout.ep.detail', { expId: EpExpInfo.getExperiment().experimentId, onEdit: true });
        };

        vm.startNewRegion = function() {
            vm.showMap = true;
            vm.isNew = true;
            vm.currRegion = null;
            vm.newRegion = {
                startDate: new Date(EpExpInfo.getNewExperiment().startDate),
                endDate: new Date(EpExpInfo.getNewExperiment().endDate),
                coordinates: []
            };
            vm.drawnItems.clearLayers();
            vm.newRegionForm.$setPristine();
            vm.map.setView(new L.LatLng(vm.center.lat, vm.center.lng), vm.center.zoom);
        };

        vm.addRegion = function() {
            vm.regions.push(vm.newRegion);
            vm.newRegion = null;
            vm.drawnItems.clearLayers();
            vm.newRegionForm.$setPristine();
            vm.map.setView(new L.LatLng(vm.center.lat, vm.center.lng), vm.center.zoom);
            vm.isNew = false;
            vm.showMap = false;
        };


        vm.showInfo = function() {
             $mdDialog.show({
                 locals: {
                     mdInfo: {
                         proceed: function() { $mdDialog.hide(); },
                         title: 'You are modifying the area of the experiment',
                         info: 'Here you can either modify the existing area of your experiment \
                         or adding new regions to it.',
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