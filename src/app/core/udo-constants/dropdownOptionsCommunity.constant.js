(function() {
  'use strict';

  /**
   * Dropdown options for community button
   * @constant
   * @type {Array}
   */

  angular.module('app.components')
    .constant('DROPDOWN_OPTIONS_COMMUNITY', [
      {text: 'About', href: 'http://organicity.eu'},
      {text: 'Events', href: 'http://organicity.eu/events'},
      {text: 'Github', href: 'https://github.com/organicityeu'},
      {text: 'APIs', href: 'https://api.organicity.eu'},
      {text: 'Support', href: 'https://support.zoho.com/portal/organicity/home'},
    ]);
})();
