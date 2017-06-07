(function() {
    'use strict';

    angular.module('app.components')
        .controller('EditAreaController', EditAreaController);

    EditAreaController.$inject = [
    '$location', 
    '$mdDialog', 
    '$window', 
    'DTOptionsBuilder', 
    'DTColumnDefBuilder',
    'NewExperiment', 
    'Experiments', 
    'leafletData', 
    'mapUtils', 
    'alert', 
    'ExpInfo', 
    '$state', 
    '$timeout', 
    '$scope'
    ];

    function EditAreaController(
        $location, 
        $mdDialog, 
        $window, 
        DTOptionsBuilder, 
        DTColumnDefBuilder,
        NewExperiment, 
        Experiments, 
        leafletData, 
        mapUtils, 
        alert, 
        ExpInfo, 
        $state, 
        $timeout, 
        $scope
    ) {

        var vm = this;
        vm.loadingChart = false;
        vm.browser = null;
        var userAgent = $window.navigator.userAgent;
        var browsers = {chrome: /chrome/i, safari: /safari/i, firefox: /firefox/i, ie: /internet explorer/i};
        for(var key in browsers) {
            if (browsers[key].test(userAgent)) {
                vm.browser = key;
            }
        }
        vm.experimentInfo = ExpInfo.getExperiment();


        // visibility states
        vm.visibility = {
            pristine: 0,
            onNew: 1,
            onEditing: 2
        };
        vm.currState = vm.visibility.pristine;
        vm.infoAdvance = false;

        // Table configuration
        vm.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withDisplayLength(5)
            .withLanguage({"sLengthMenu": "Show _MENU_ regions"})
            .withOption('lengthMenu', [5, 10, 50]);

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

        // Map configuration
        vm.map = null;
        vm.regions =  ExpInfo.getExperiment().area || [];
        vm.currRegion = {};
        vm.currCoordsStr = '';
        //vm.tiles = mapUtils.getBaseLayers().oc.url;
        vm.drawnItems = new L.FeatureGroup();
        var options = {
            edit: { featureGroup: vm.drawnItems },
            draw: { polyline: false, marker: false, rectangle: false, circle: false },
            showRadius: true
        };
        vm.controls = {custom: [new L.Control.Draw(options)]};
        vm.layers = { baselayers: mapUtils.getBaseLayers() };
        vm.center = {lat: 48, lng: 18.5, zoom: 4 };

        vm.startNewRegion = function() {
            vm.currCoordsStr = '';
            vm.drawnItems.clearLayers();
            vm.recenter();
            vm.currState = vm.visibility.onNew;
            vm.currRegion = {
                startDate: new Date(ExpInfo.getNewExperiment().startDate),
                endDate: new Date(ExpInfo.getNewExperiment().endDate),
                min: '',
                max: '',
                weight: '',
                coordinates: []
            };
            
            vm.regionForm.$setPristine();
            $timeout(function() {
                vm.map._onResize();
            }, 500);
        };

        vm.addRegion = function() {
            vm.regions.push(vm.currRegion);
            vm.currRegion = {};
            vm.drawnItems.clearLayers();
            vm.regionForm.$setPristine();
            vm.currState = vm.visibility.pristine;
        };

        vm.cancelEdition = function () {
            vm.drawnItems.clearLayers();
            vm.recenter();
            vm.currRegion = {};
            vm.regionForm.$setPristine();
            vm.drawnItems.clearLayers();
            vm.currState = vm.visibility.pristine;
        };       

        vm.updateCoords = function () {
            vm.currRegion.coordinates = str2Coords(vm.currCoordsStr);

            vm.drawnItems.clearLayers();
            vm.map.removeLayer(vm.drawnItems);
            vm.recenter();
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
            vm.map.addLayer(vm.drawnItems);
            vm.currCoordsStr = coords2Str(vm.currRegion.coordinates);
            
            $timeout(function() {
                if (vm.drawnItems.getLayers().length > 0) {
                   vm.map.fitBounds(vm.drawnItems.getBounds());
                }
                vm.map._onResize();
            }, 100);   
        };

        vm.detail = function(region) {
            vm.drawnItems.clearLayers();
            vm.map.removeLayer(vm.drawnItems);
            vm.recenter();
            vm.currState = vm.visibility.onEditing;
            vm.regionForm.$setPristine();

            vm.currRegion = region;            
            vm.currRegion.startDate = new Date(region.startDate);
            vm.currRegion.endDate = new Date(region.endDate);
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
            vm.map.addLayer(vm.drawnItems);
            vm.currCoordsStr = coords2Str(vm.currRegion.coordinates);
            $timeout(function() {
                if (vm.drawnItems.getLayers().length > 0) {
                    vm.map.fitBounds(vm.drawnItems.getBounds());
                }
                vm.map._onResize();
            }, 100);       
        };

        vm.recenter = function () {
            var fitBoundsSouthWest = new L.LatLng(37.019755, -3);
            var fitBoundsNorthEast = new L.LatLng(51.625345, 17.474800);
            var fitBoundsArea = new L.LatLngBounds(fitBoundsSouthWest, fitBoundsNorthEast);
            vm.map.fitBounds(fitBoundsArea, {reset: true}); 
        };

        function coords2Str (arr) {
            if (!arr)
            {
                return '';
            }
            var str = '';
            for (var i = 0; i < arr.length-1; ++i) {
                str += arr[i].toString() + '; ';
            }
            str += arr[arr.length-1].toString();
            return str;
        }

        function str2Coords (str) {
            var arr1 = str.split(';');
            var arr2 = [];
            for (var i = 0; i < arr1.length; i++) {
                var aux  = arr1[i].split(',');
                arr2.push([Number(aux[0]), Number(aux[1])]);
            }
            return arr2;
        }

        init();

        function init() {
            leafletData.getMap('regionEdition').then(function(map) {
            vm.map = map;
            map.addLayer(vm.drawnItems);
            map.on('draw:created', function(e) {
                var layer = e.layer;
                if (vm.drawnItems.getLayers().length === 0) {
                    vm.drawnItems.addLayer(layer);
                    map.fitBounds(vm.drawnItems.getBounds());
                    var shape = layer.toGeoJSON();
                    vm.currRegion.coordinates = shape.geometry.coordinates[0];
                    vm.currCoordsStr = coords2Str(vm.currRegion.coordinates);
                } else {
                    alert.error('A region consists of just one polygon');
                }
            });

            map.on('draw:edited', function(e) {
                var layers = e.layers;
                layers.eachLayer(function(layer) {
                    var shape = layer.toGeoJSON();
                    vm.currRegion.coordinates = shape.geometry.coordinates[0];
                });
                map.fitBounds(vm.drawnItems.getBounds());
                vm.currCoordsStr = coords2Str(vm.currRegion.coordinates);
            });
            });
        }


        vm.canCreateRegion = function () {
            if (vm.currRegion.coordinates === undefined) {
                return false;
            }
            if (vm.regionForm.$invalid || vm.currRegion.coordinates.length === 0) {
                return false;
            }
            return true;
        };
        
        vm.finishEdition = function () {
            vm.cancelEdition();
        };

        vm.remove = function(ev, item) {
            var index = vm.regions.indexOf(item);
            if (index > -1) {
                vm.regions.splice(index, 1);
            }
        };

        vm.showInfo = function() {
            $mdDialog.show({
                locals: {
                    mdInfo: {
                        proceed: function() { $mdDialog.hide(); },
                        title: 'You are modifying the area of the experiment',
                        info: 'Here you can either modify the existing area of your experiment or adding new regions to it.',
                    }
                },
                controller: 'EpErrorController as vm',
                templateUrl: 'app/components/ep/epError.html',
                clickOutsideToClose: false
            });
         };

        vm.showInfoAdvance = function () {
            vm.infoAdvance = vm.infoAdvance ? false : true;
        };

        vm.cancel = function() {
            vm.loadingChart = true;
            $state.go('layout.detail', { expId: ExpInfo.getExperiment().experimentId });
        };

        vm.done = function() {
            vm.loadingChart = true;
            ExpInfo.setNewRegions(vm.regions);
            ExpInfo.update(successUpdate, errorUpdate);
        };

        function successUpdate() {
            alert.success('Experiment successfully updated');
            vm.loadingChart = false;
            vm.goExp();
        }

        function errorUpdate() {
            alert.success('Experiment could not be updated');
            vm.loadingChart = false;
            $state.go($state.current);
        }

        vm.startInfo = false;
        vm.showStartInfo = function () {
            vm.startInfo = vm.startInfo ? false : true;
        };

        vm.goHome = function (){
            $state.go('layout.exps');
        };

        vm.goExp = function (){
            $state.go('layout.detail', { expId: vm.experimentInfo.experimentId });
        };
    }
})();