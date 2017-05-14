'use strict';
'ngInject';

angular.module('appliancePointOfSale').component('billingInformation', {
  bindings: {
    ticket: '<',
  },
  controller: function() {
  },
  templateUrl: 'ticket-panel/billing-information/billing-information.tpl.html'
});
