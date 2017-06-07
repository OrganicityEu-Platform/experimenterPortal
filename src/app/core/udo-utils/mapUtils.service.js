(function() {
    'use strict';
    angular.module('app.components').factory('mapUtils', mapUtils);
    mapUtils.$inject = [];

    function mapUtils() {
        var service = {
            getDefaultFilters: getDefaultFilters,
            setDefaultFilters: setDefaultFilters,
            canFilterBeRemoved: canFilterBeRemoved,
            getBaseLayers: getBaseLayers
        };
        return service;
        //////////////
        function getBaseLayers() {
            return {
                oc: {
                    group: 's',
                    name: 'Organicity',
                    type: 'xyz',
                    url: 'https://api.tiles.mapbox.com/v4/tomasdiez.ed7899f5/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoidG9tYXNkaWV6IiwiYSI6ImRTd01HSGsifQ.loQdtLNQ8GJkJl2LUzzxVg'
                },
                osm: {
                    group: 's',
                    name: 'Default',
                    type: 'xyz',
                    url: 'https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidG9tYXNkaWV6IiwiYSI6ImRTd01HSGsifQ.loQdtLNQ8GJkJl2LUzzxVg'
                },
                sat: {
                    name: 'satellite',
                    type: 'xyz',
                    url: 'https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidG9tYXNkaWV6IiwiYSI6ImRTd01HSGsifQ.loQdtLNQ8GJkJl2LUzzxVg'
                }
            };
        }

        function getDefaultFilters(filterData, defaultFilters) {
            var obj = {};
            if (!filterData.online && !filterData.offline) {
                obj[defaultFilters.status] = true;
            }
            return obj;
        }

        function setDefaultFilters(filterData, defaultFilters) {
            var obj = {};
            if (!filterData.online || !filterData.offline) {
                obj.status = filterData.online ? 'online' : 'offline';
            }
            return obj;
        }

        function canFilterBeRemoved(filterData, filterName) {
            if (filterName === 'online' || filterName === 'offline') {
                return filterData.online && filterData.offline;
            }
        }
    }
})();
