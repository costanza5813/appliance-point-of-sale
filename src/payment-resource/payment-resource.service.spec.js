'use strict';

describe('Service: paymentResource', function () {
  beforeEach(module('appliancePointOfSale'));

  beforeEach(inject(function ($httpBackend, $q, paymentResource) {
    this.$httpBackend = $httpBackend;
    this.$q = $q;
    this.paymentResource = paymentResource;
  }));

  describe('fetchPayment', function () {
    beforeEach(function () {
      this.uri = '/ShoreTVCustomers/ServiceTickets/payments/123';
    });

    it('should return the payment for the given id', function (done) {
      this.$httpBackend.expectGET(this.uri).respond({ paymentAmount: 132.25, paymentType: 4 });

      this.paymentResource.fetchPayment('123').then((payment) => {
        expect(payment).toEqual(jasmine.any(this.paymentResource.Payment));
        expect(payment.paymentType).toBe(this.paymentResource.Payment.ePaymentTypes.cash.value);
        done();
      });

      this.$httpBackend.flush();
    });

    it('should return a promise that rejects on an error', function (done) {
      this.$httpBackend.expectGET(this.uri).respond(404);

      this.paymentResource.fetchPayment('123').catch((error) => {
        expect(error.status).toBe(404);
        done();
      });

      this.$httpBackend.flush();
    });
  });

  describe('fetchPaymentsForTicket', function () {
    beforeEach(function () {
      this.uri = '/ShoreTVCustomers/ServiceTickets/payments/456';
    });

    it('should return the payments for the given ticket', function (done) {
      const response = {};
      _.set(response, '_embedded.payments', [{ paymentAmount: 209.43, paymentType: 3 }]);

      this.$httpBackend.expectGET(this.uri).respond(response);

      const ticket = { paymentsHref: this.uri, updateTotals: () => 'updateTotals' };
      this.paymentResource.fetchPaymentsForTicket(ticket).then((payments) => {
        expect(payments).toEqual(jasmine.any(Array));
        expect(payments.length).toBe(1);
        expect(payments[0]).toEqual(jasmine.any(this.paymentResource.Payment));
        expect(payments[0].paymentType).toBe(this.paymentResource.Payment.ePaymentTypes.check.value);
        done();
      });

      this.$httpBackend.flush();
    });

    it('should return a promise that rejects on an error', function (done) {
      this.$httpBackend.expectGET(this.uri).respond(404);

      const ticket = { paymentsHref: this.uri };
      this.paymentResource.fetchPaymentsForTicket(ticket).catch((error) => {
        expect(error.status).toBe(404);
        done();
      });

      this.$httpBackend.flush();
    });
  });

  describe('createPaymentForTicket', function () {
    beforeEach(function () {
      this.uri = '/ShoreTVCustomers/ServiceTickets/payments/';
      this.ticket = { selfHref: '/ShoreTVCustomers/ServiceTickets/tickets/111', updateTotals: () => 'updateTotals' };
    });

    it('should return the newly created payment', function (done) {
      this.$httpBackend.expectPOST(this.uri,
                                   _.assign(this.paymentResource.Payment.defaults, { ticket: this.ticket.selfHref }))
        .respond({ paymentAmount: 311.78, paymentType: 2 });

      this.paymentResource.createPaymentForTicket(this.ticket).then((payment) => {
        expect(payment).toEqual(jasmine.any(this.paymentResource.Payment));
        expect(payment.paymentType).toBe(this.paymentResource.Payment.ePaymentTypes.charge.value);
        expect(payment._updateTicket).toEqual(jasmine.any(Function));
        done();
      });

      this.$httpBackend.flush();
    });

    it('should return a promise that rejects on an error', function (done) {
      this.$httpBackend.expectPOST(this.uri,
                                   _.assign(this.paymentResource.Payment.defaults, { ticket: this.ticket.selfHref }))
        .respond(404);

      this.paymentResource.createPaymentForTicket(this.ticket).catch((error) => {
        expect(error.status).toBe(404);
        done();
      });

      this.$httpBackend.flush();
    });
  });

  describe('updatePayment', function () {
    beforeEach(function () {
      this.uri = '/ShoreTVCustomers/ServiceTickets/payments/789';
      this.payment = new this.paymentResource.Payment();
      this.payment.paymentAmount = 487.44;
      this.payment.paymentType = 1;
      _.set(this.payment.rawData, '_links.self.href', this.uri);
    });

    it('should return a promise that resolves if update successful', function (done) {
      this.$httpBackend.expectPUT(this.uri, this.payment.rawData).respond({});

      this.paymentResource.updatePayment(this.payment).then((response) => {
        expect(response.status).toBe(200);
        done();
      });

      this.$httpBackend.flush();
    });

    it('should return a promise that rejects on an error', function (done) {
      this.$httpBackend.expectPUT(this.uri, this.payment.rawData).respond(404);

      this.paymentResource.updatePayment(this.payment).catch((error) => {
        expect(error.status).toBe(404);
        done();
      });

      this.$httpBackend.flush();
    });
  });

  describe('deletePayment', function () {
    beforeEach(function () {
      this.uri = '/ShoreTVCustomers/ServiceTickets/payments/222';
      this.payment = new this.paymentResource.Payment();
      this.payment.paymentAmount = 589.11;
      this.payment.paymentType = 5;
      _.set(this.payment.rawData, '_links.self.href', this.uri);
    });

    it('should return a promise that resolves if delete successful', function (done) {
      this.$httpBackend.expectDELETE(this.uri).respond({});

      this.paymentResource.deletePayment(this.payment).then((response) => {
        expect(response.status).toBe(200);
        done();
      });

      this.$httpBackend.flush();
    });

    it('should return a promise that rejects on an error', function (done) {
      this.$httpBackend.expectDELETE(this.uri).respond(404);

      this.paymentResource.deletePayment(this.payment).catch((error) => {
        expect(error.status).toBe(404);
        done();
      });

      this.$httpBackend.flush();
    });
  });
});
