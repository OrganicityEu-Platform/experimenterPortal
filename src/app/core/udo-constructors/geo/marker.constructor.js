(function() {
  'use strict';

  angular.module('app.components')
    .factory('Marker', ['asset', 'markerUtils', function(asset, markerUtils) {

      /**
       * Marker constructor
       * @constructor
       * @param {Object} entityData - Object with data about marker from API
       * @property {number} lat - Latitude
       * @property {number} lng - Longitude
       * @property {string} message - Message inside marker popup
       * @property {Object} icon - Object with classname, size and type of marker icon
       * @property {string} layer - Map layer that icons belongs to
       * @property {boolean} focus - Whether marker popup is opened
       * @property {Object} myData - Marker id and labels
       */
      function Marker(entityData) {
        this.lat = markerUtils.parseCoordinates(entityData).lat;
        this.lng = markerUtils.parseCoordinates(entityData).lng;
        this.message = '<div class="popup"><div class="popup_top ' + markerUtils.classify(markerUtils.parseType(entityData)) + '"><p class="popup_name">' + markerUtils.parseName(entityData) + '</p><p class="popup_type">' + markerUtils.parseType(entityData) + '</p><p class="popup_time"><md-icon class="popup_icon" md-svg-src="./assets/images/update_icon.svg"></md-icon>' + markerUtils.parseTime(entityData) + '</p></div><div class="popup_bottom"><p class="popup_location"><md-icon class="popup_icon" md-svg-src="./assets/images/location_icon_dark.svg"></md-icon>' + markerUtils.parseLocation(entityData) + '</p><div class="popup_labels">' + createTagsTemplate(markerUtils.parseLabels(entityData)) + createTagsTemplate(markerUtils.parseUserTags(entityData)) + '</div></div></div>'; //<span>' + markerUtils.parseLabels(entityData).status + '</span><span>' + markerUtils.parseLabels(entityData).exposure + '</span>
        this.icon = markerUtils.getIcon(markerUtils.parseLabels(entityData));
        this.layer = 'realworld';
        this.focus = false;
        this.myData = {
          id: markerUtils.parseId(entityData),
          labels: markerUtils.parseLabels(entityData)
        };
      }

      return Marker;

      function createTagsTemplate(tagsArr) {
        return _.reduce(tagsArr, function(acc, label) {
          return acc.concat('<span>' + label + '</span>');
        }, '');
      }

    }]);
})();
