(function() {
  'use strict';

  /**
   * Marker icons
   * @constant
   * @type {Object}
   */

  angular.module('app.components')
    .constant('MARKER_ICONS', {
      defaultIcon: {},
      markerEntitiesNormal: {
        type: 'div',
        className: 'markerEntitiesNormal',
        iconSize: [24, 24]
      },
      markerEntitiesOnline: {
        type: 'div',
        className: 'markerEntitiesOnline',
        iconSize: [24, 24]
      },
      markerEntitiesOnlineActive: {
        type: 'div',
        className: 'markerEntitiesOnline marker_blink',
        iconSize: [24, 24]
      },
      markerEntitiesOffline: {
        type: 'div',
        className: 'markerEntitiesOffline',
        iconSize: [24, 24]
      },
      markerEntitiesOfflineActive: {
        type: 'div',
        className: 'markerEntitiesOffline marker_blink',
        iconSize: [24, 24]
      }
    });
})();
