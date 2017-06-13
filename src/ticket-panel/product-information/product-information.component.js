'use strict';
'ngInject';

angular.module('appliancePointOfSale').component('productInformation', {
  bindings: {
    ticket: '<',
  },
  controller: function (typeaheadOptions) {
    typeaheadOptions.brands.then((brands) => {
      this.brands = brands;
    });

    typeaheadOptions.descriptions.then((descriptions) => {
      this.descriptions = descriptions;
    });
  },

  templateUrl: 'ticket-panel/product-information/product-information.tpl.html',
});
