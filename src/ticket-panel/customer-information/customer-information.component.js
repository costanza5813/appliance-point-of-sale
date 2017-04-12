'use strict';
'ngInject';

angular.module('appliancePointOfSale').component('customerInformation', {
  bindings: {
    type: '<',
    isBillingSame: '=?'
  },
  controller: function() {

    this.getInformationTitle = () => {
      return _.capitalize(this.type) || 'Customer';
    };
  },
  templateUrl: 'ticket-panel/customer-information/customer-information.tpl.html'
});
