'use strict';

describe('Component: totalDue', function () {
  beforeEach(module('appliancePointOfSale'));

  beforeEach(inject(function ($componentController, $q, $rootScope, Ticket) {
    this.$componentController = $componentController;
    this.$q = $q;
    this.$scope = $rootScope.$new();

    this.ticket = new Ticket();

    this.locals = {};
    this.bindings = { ticket: this.ticket };
    this.createController = () => $componentController('totalDue', this.locals, this.bindings);
  }));

  describe('createNewPayment', function () {
    beforeEach(inject(function (paymentResource) {
      this.paymentResource = paymentResource;
      spyOn(paymentResource, 'createPaymentForTicket')
        .and.returnValue(this.$q.resolve(new paymentResource.Payment({ paymentAmount: 199.99 })));
    }));

    it('should call createPaymentForTicket providing the current ticket', function () {
      const ctrl = this.createController();
      ctrl.createNewPayment();
      expect(this.paymentResource.createPaymentForTicket).toHaveBeenCalledWith(this.ticket);
    });

    it('should add the new part to the ticket parts list', function () {
      const ctrl = this.createController();
      ctrl.createNewPayment();
      this.$scope.$digest();
      expect(this.ticket.payments.length).toBe(1);
      expect(this.ticket.payments[0].paymentAmount).toBe(199.99);
    });
  });

  describe('deletePayment', function () {
    beforeEach(inject(function ($uibModal, Payment) {
      this.$uibModal = $uibModal;
      spyOn($uibModal, 'open');

      this.payment = new Payment();
    }));

    it('should open a modal dialog with the correct options', function () {
      this.$uibModal.open.and.returnValue({ result: this.$q.resolve() });

      const ctrl = this.createController();
      ctrl.deletePayment(this.payment);

      expect(this.$uibModal.open).toHaveBeenCalled();
      expect(this.$uibModal.open.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({
        backdrop: 'static',
        keyboard: false,
        component: 'confirmDelete',
      }));
      expect(this.$uibModal.open.calls.mostRecent().args[0].resolve.type()).toBe('payment');
    });

    it('should mark the payment as deleted only if the modal resolves', function () {
      const ctrl = this.createController();

      this.$uibModal.open.and.returnValue({ result: this.$q.reject() });
      ctrl.deletePayment(this.payment);

      this.$scope.$digest();

      expect(this.payment.deleted).toBeFalsy();

      this.$uibModal.open.and.returnValue({ result: this.$q.resolve() });
      ctrl.deletePayment(this.payment);

      this.$scope.$digest();

      expect(this.payment.deleted).toBeTruthy();
    });
  });
});
