'use strict';
'ngInject';

angular.module('appliancePointOfSale').component('billingInformation', {
  bindings: {
    ticket: '<',
    type: '<',
  },
  controller: function() {

    this.getInformationTitle = () => {
      return _.capitalize(this.type) || 'Billing';
    };
  },
  templateUrl: 'ticket-panel/billing-information/billing-information.tpl.html'
});
