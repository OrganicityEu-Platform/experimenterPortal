(function() {
    'use strict';
    angular.module('app.components').factory('Overlays', ['Layer', function(Layer) {
        /**
         * Overlays constructor
         * @constructor
         * @param {Object} featureCollections - An array of FeatureCollections
         */
        function Overlays(featureCollections, group) {
            var self = this;
            if (!featureCollections.length) {
              featureCollections = [featureCollections];
            }
            _.each(featureCollections, function(featureCollection) {
                self[getOverlayName(featureCollection)] = new Layer(featureCollection, group);
            });
        }

        return Overlays;

        function getOverlayName(featureCollection) {
          if (featureCollection.properties) {
            return camelize(featureCollection.properties.name);
          }
        }

        function camelize(str) {
            return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
                return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
            }).replace(/\s+/g, '');
        }
    }]);
})();
