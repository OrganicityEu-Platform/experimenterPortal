(function() {
  'use strict';

  /**
   * Dropdown options for entitites
   * @constant
   * @type {Array}
   */
  
  angular.module('app.components')
    .constant('DROPDOWN_OPTIONS_entity', [
      {text: 'SET UP', value: '1', href: '/entitites/new'},
      {text: 'EDIT', value: '2', href: '/entitites/edit/'}
    ]);
})();
