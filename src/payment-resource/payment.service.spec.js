'use strict';

describe('Factory: Payment', function () {
  beforeEach(module('appliancePointOfSale'));

  beforeEach(inject(function (Payment) {
    this.Payment = Payment;
  }));

  describe('constructor', function () {
    it('should use default values if no rawData is provided', function () {
      const payment = new this.Payment();
      expect(payment.rawData).toEqual(this.Payment.defaults);
    });

    it('should override defaults with provided rawData', function () {
      const payment = new this.Payment({ paymentAmount: 574.49 });
      expect(payment.paymentAmount).toBe(574.49);
    });

    it('should initialize deleted to false', function () {
      const payment = new this.Payment();
      expect(payment.deleted).toBe(false);
    });

    it('should set the _updateTicket function if provided', function () {
      const updateTicket = () => 'updateTicket';
      const payment = new this.Payment({}, updateTicket);
      expect(payment._updateTicket).toBe(updateTicket);
    });
  });

  describe('get id', function () {
    it('should return the payment id', function () {
      const payment = new this.Payment();
      _.set(payment.rawData, '_links.self.href', '/ShoreTVCustomers/ServiceTickets/payments/123');
      expect(payment.id).toBe('123');
    });

    it('should return undefined if the self link does not exist', function () {
      const payment = new this.Payment();
      expect(payment.id).toBeUndefined();
    });
  });

  describe('selfHref', function () {
    it('should return the self href', function () {
      const payment = new this.Payment();
      _.set(payment.rawData, '_links.self.href', '/ShoreTVCustomers/ServiceTickets/payments/123');
      expect(payment.selfHref).toBe('/ShoreTVCustomers/ServiceTickets/payments/123');
    });

    it('should return undefined if the self link does not exist', function () {
      const payment = new this.Payment();
      expect(payment.selfHref).toBeUndefined();
    });
  });

  describe('get/set checkNumber', function () {
    it('should update the check number correctly', function () {
      const payment = new this.Payment();
      payment.checkNumber = '1234';
      expect(payment.checkNumber).toBe('1234');
    });
  });

  describe('get/set paymentAmount', function () {
    it('should update the payment amount correctly', function () {
      const payment = new this.Payment();
      payment.paymentAmount = 567.89;
      expect(payment.paymentAmount).toBe(567.89);
    });

    it('should call _updateTicket on update', function () {
      const updateTicket = () => 'updateTicket';
      const payment = new this.Payment({}, updateTicket);
      spyOn(payment, '_updateTicket');
      payment.paymentAmount = 112.34;
      expect(payment._updateTicket).toHaveBeenCalled();
    });
  });

  describe('get/set paymentDate', function () {
    it('should update the payment date correctly', function () {
      const payment = new this.Payment();
      payment.paymentDate = '12/12/2012 12:12 PM';
      expect(payment.paymentDate).toBe('12/12/2012 12:12 PM');
    });
  });

  describe('get/set paymentType', function () {
    it('should update the payment type correctly', function () {
      const payment = new this.Payment();
      payment.paymentType = 1;
      expect(payment.paymentType).toBe(this.Payment.ePaymentTypes.cod.value);
    });

    it('should call _updateTicket on update', function () {
      const updateTicket = () => 'updateTicket';
      const payment = new this.Payment({}, updateTicket);
      spyOn(payment, '_updateTicket');
      payment.paymentType = 2;
      expect(payment._updateTicket).toHaveBeenCalled();
    });
  });

  describe('get/set reconciledNotes', function () {
    it('should update the reconciled notes correctly', function () {
      const payment = new this.Payment();
      payment.reconciledNotes = 'Paid in full';
      expect(payment.reconciledNotes).toBe('Paid in full');
    });
  });

  describe('get/set deleted', function () {
    it('should update deleted correctly', function () {
      const payment = new this.Payment();
      payment.deleted = true;
      expect(payment.deleted).toBe(true);
    });

    it('should call _updateTicket on update', function () {
      const updateTicket = () => 'updateTicket';
      const payment = new this.Payment({}, updateTicket);
      spyOn(payment, '_updateTicket');
      payment.deleted = true;
      expect(payment._updateTicket).toHaveBeenCalled();
    });
  });
});
