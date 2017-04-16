'use strict';
'ngInject';

const baseUri = '/ShoreTVCustomers/ServiceTickets/payments/';

class PaymentResource {
  constructor($http, $q, Payment) {
    this.$http = $http;
    this.Payment = Payment;

    //kdj TODO
    this.$q = $q;
  }

  fetchPayment(id) {
    return this.$http.get(baseUri + id).then((response) => response.data);
  }

  fetchPaymentsForTicket(ticket) {
    //return this.$http.get(ticket.paymentsHref).then((response) => response.data._embedded.payments);

    return this.$q.resolve([]);
  }

  createPaymentForTicket(ticket) {
    // return this.$http.post(baseUri, _.assign(this.Payment.defaults, { ticket: ticket.selfHref }))
    //   .then((response) => response.data);

    return this.$q.resolve({
      paymentAmount: 0,
      paymentDate: '',
      paymentType: 0,
      reconciled: true,
      reconciledNotes: '',
      _links: {
        self: {
          href: 'http://localhost:9083/ShoreTVCustomers/ServiceTickets/payments/1'
        },
      },
    });
  }

  updatePayment(payment) {
    return this.$http.put(payment.selfHref, payment.rawData);
  }
}

angular.module('appliancePointOfSale').factory('paymentResource', PaymentResource);
