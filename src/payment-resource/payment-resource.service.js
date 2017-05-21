'use strict';
'ngInject';

const baseUri = '/ShoreTVCustomers/ServiceTickets/payments/';

class PaymentResource {
  constructor($http, Payment) {
    this.$http = $http;
    this.Payment = Payment;
  }

  fetchPayment(id) {
    return this.$http.get(baseUri + id).then((response) => response.data);
  }

  fetchPaymentsForTicket(ticket) {
    return this.$http.get(ticket.paymentsHref)
      .then((response) => _.get(response.data, '_embedded.payments', []));
  }

  createPaymentForTicket(ticket) {
    return this.$http.post(baseUri, _.assign(this.Payment.defaults, { ticket: ticket.selfHref }))
      .then((response) => response.data);
  }

  updatePayment(payment) {
    return this.$http.put(payment.selfHref, payment.rawData);
  }

  deletePayment(payment) {
    return this.$http.delete(payment.selfHref);
  }
}

angular.module('appliancePointOfSale').factory('paymentResource', PaymentResource);
