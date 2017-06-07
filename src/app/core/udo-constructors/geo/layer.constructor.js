(function() {
    'use strict';
    angular.module('app.components').factory('Layer', ['miniMarker', 'markerUtils', function(miniMarker, markerUtils) {
        /**
         * Layer constructor
         * @constructor
         * @param {Object} FeatureCollection - geoJSON Object with entities layer
         */
        function Layer(FeatureCollection, group) {
            this.name = markerUtils.parseEntityType(FeatureCollection.properties);
            this.type = 'geoJSONShape';
            this.visible = true;
            this.data = FeatureCollection;
            this.alldata = FeatureCollection;
            this.layerOptions = {
                cluster: true,
                showCoverageOnHover: false,
                iconCreateFunction: iconCreateFunction,
                onEachFeature: onEachFeature,
                pointToLayer: pointTolayer,
            };
            this.disablePoints = disablePoints;
            this.doRefresh = false;
            if (group) {
              this.group = group;
            }
        }

        return Layer;

        function disablePoints(myScope) {
             data =  _.filter(data.features, function(feature){ return feature.geometry.type !== 'Point';});
             doRefresh = true;
             myScope.$apply();
        }

        function pointTolayer(obj) {
            var icon = L.divIcon(markerUtils.getIcon(markerUtils.parseLabels(obj.properties)));
            var c = obj.geometry.coordinates;
            var d = [];
            d[0] = c[1];
            d[1] = c[0];
            return L.marker(d, {
                icon: icon
            });
        }

        function iconCreateFunction(cluster) {
            var childCount = cluster.getChildCount();
            var a = cluster.getAllChildMarkers();
            var c = ' marker-cluster-';
            if (childCount < 5) {
                c += 'small';
            } else if (childCount < 40) {
                c += 'medium';
            } else {
                c += 'large';
            }
            return new L.DivIcon({
                html: '<div><span>' + childCount + '</span></div>',
                className: 'marker-cluster' + c,
                iconSize: new L.Point(40, 40)
            });
        }

        function onEachFeature(feature, layer) {
            var marker = new miniMarker(feature);
            layer.bindPopup(marker.popupHtml);
            layer.on({
                click: function() {
                    window.location.href = '/assets/' + layer.feature.properties.id;
                  }
            });
        }

        function camelize(str) {
            return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
                return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
            }).replace(/\s+/g, '');
        }
    }]);
})();
