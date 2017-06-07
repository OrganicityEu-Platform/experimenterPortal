(function() {
  'use strict';

  /**
   * Tools links for user profile
   * @constant
   * @type {Array}
   */

  angular.module('app.components')
    .constant('PROFILE_TOOLS', [
      {type: 'community', title: 'Tool 1', description: 'Your feedback is important for us', avatar: ''},
      {type: 'documentation', title: 'Tool 1 Docs', description: 'Fork the project', avatar: ''},
      {type: 'social', title: 'Twitter', description: 'Follow our news on Twitter', avatar: ''},
    ]);
})();
