'use strict';
'ngInject';

angular.module('appliancePointOfSale').component('error', {
  bindings: {
    error: '<',
  },
  controller: function (snapRemote) {
    snapRemote.open('left');
  },

  templateUrl: 'error/error.tpl.html',
});
