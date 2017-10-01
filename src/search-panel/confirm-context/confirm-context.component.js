'use strict';
'ngInject';

angular.module('appliancePointOfSale').component('confirmContext', {
  bindings: {
    modalInstance: '<',
  },
  controller: function () {
    this.dismiss = () => {
      this.modalInstance.dismiss();
    };

    this.chooseTicket = () => {
      this.modalInstance.close('ticket');
    };

    this.choosePurchase = () => {
      this.modalInstance.close('purchase');
    };
  },

  templateUrl: 'search-panel/confirm-context/confirm-context.tpl.html',
});
