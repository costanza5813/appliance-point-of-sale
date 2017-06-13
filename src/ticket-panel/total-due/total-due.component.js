'use strict';
'ngInject';

angular.module('appliancePointOfSale').component('totalDue', {
  bindings: {
    ticket: '<',
  },
  controller: function ($uibModal, Payment, paymentResource) {
    this.paymentTypes = Payment.ePaymentTypes;

    this.createNewPayment = () => {
      paymentResource.createPaymentForTicket(this.ticket).then((payment) => { this.ticket.addPayment(payment); });
    };

    this.deletePayment = (payment) => {
      const modalOptions = {
        backdrop: 'static',
        keyboard: false,
        component: 'confirmDelete',
        resolve: {
          type: () => {
            return 'payment';
          },
        },
      };

      $uibModal.open(modalOptions).result.then(() => {
        payment.deleted = true;
      });

    };
  },

  templateUrl: 'ticket-panel/total-due/total-due.tpl.html',
});
