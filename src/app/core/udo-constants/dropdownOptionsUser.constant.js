(function() {
  'use strict';

  /**
   * Dropdown options for user
   * @constant
   * @type {Array}
   */
  angular.module('app.components')
    .constant('DROPDOWN_OPTIONS_USER', [
      {divider: true, text: 'Hello,'},
      {text: 'PROFILE', href: 'https://accounts.organicity.eu/realms/organicity/account'},
      {text: 'LOGOUT', href: './logout'}
    ]);
})();
