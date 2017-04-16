'use strict';
'ngInject';

angular.module('appliancePointOfSale').component('productInformation', {
  bindings: {
    ticket: '<',
    type: '<',
  },
  controller: function() {
  },
  templateUrl: 'ticket-panel/product-information/product-information.tpl.html'
});
