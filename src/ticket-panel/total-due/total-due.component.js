'use strict';
'ngInject';

angular.module('appliancePointOfSale').component('totalDue', {
  bindings: {
    ticket: '<',
  },
  controller: function(Payment, paymentResource) {
    this.paymentTypes = Payment.ePaymentTypes;

    this.createNewPayment = () => {
      paymentResource.createPaymentForTicket(this.ticket).then((rawPayment) => {
        this.ticket.addPayment(new Payment(rawPayment, this.ticket.updateTotals.bind(this.ticket)));
      });
    };
  },
  templateUrl: 'ticket-panel/total-due/total-due.tpl.html'
});
