'use strict';
'ngInject';

const baseUri = '/ShoreTVCustomers/ServiceTickets/payments/';

class PaymentResource {
  constructor($http, Payment) {
    this.$http = $http;
    this.Payment = Payment;
  }

  fetchPayment(id) {
    return this.$http.get(baseUri + id).then((response) => this.Payment(response.data));
  }

  fetchPaymentsForTicket(ticket) {
    return this.$http.get(ticket.paymentsHref).then((response) => {
      const rawPayments = _.get(response.data, '_embedded.payments', []);
      return _.map(rawPayments, (rawPayment) => new this.Payment(rawPayment, ticket.updateTotals.bind(ticket)));
    });
  }

  createPaymentForTicket(ticket) {
    return this.$http.post(baseUri, _.assign(this.Payment.defaults, { ticket: ticket.selfHref }))
      .then((response) => new this.Payment(response.data, ticket.updateTotals.bind(ticket)));
  }

  updatePayment(payment) {
    return this.$http.put(payment.selfHref, payment.rawData);
  }

  deletePayment(payment) {
    return this.$http.delete(payment.selfHref);
  }
}

angular.module('appliancePointOfSale').service('paymentResource', PaymentResource);
