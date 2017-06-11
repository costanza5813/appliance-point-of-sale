'use strict';

describe('Service: currentSelections', function () {
  beforeEach(module('appliancePointOfSale'));

  beforeEach(inject(function ($q, $rootScope, currentSelections, customerResource, partResource, paymentResource,
                              serviceResource, ticketResource) {
    this.$q = $q;
    this.$scope = $rootScope.$new();
    this.currentSelections = currentSelections;
    this.customerResource = customerResource;
    this.partResource = partResource;
    this.paymentResource = paymentResource;
    this.serviceResource = serviceResource;
    this.ticketResource = ticketResource;

    this.addComponents = () => {
      currentSelections.customer.addTicket(currentSelections.ticket);

      const ticket = currentSelections.ticket;
      for (let i = 0; i < 3; i++) {
        ticket.addPart(new partResource.Part({}, ticket.updateTotals.bind(ticket)));
        ticket.addPayment(new paymentResource.Payment({}, ticket.updateTotals.bind(ticket)));
        ticket.addService(new serviceResource.Service());
      }

      currentSelections.customer = currentSelections.customer;
      currentSelections.ticket = currentSelections.ticket;
    };
  }));

  describe('constructor', function () {
    it('should set the customer and ticket to defaults', function () {
      expect(this.currentSelections.customer).toEqual(jasmine.any(this.customerResource.Customer));
      expect(this.currentSelections.ticket).toEqual(jasmine.any(this.ticketResource.Ticket));
    });

    it('should set the last saved customer and ticket', function () {
      expect(this.currentSelections._customerSaved).toEqual(this.currentSelections.customer);
      expect(this.currentSelections._customerSaved).not.toBe(this.currentSelections.customer);

      expect(this.currentSelections._ticketSaved).toEqual(this.currentSelections.ticket);
      expect(this.currentSelections._ticketSaved).not.toBe(this.currentSelections.ticket);
    });
  });

  describe('_isEqual', function () {
    beforeEach(function () {
      this.addComponents();
    });

    it('should return false if the the component count is different', function () {
      const parts = this.currentSelections.ticket.parts;
      const partsSaved = this.currentSelections._ticketSaved.parts;
      parts.length = 2;
      expect(this.currentSelections._isEqual(parts, partsSaved)).toBe(false);
    });

    it('should return false if one of the the component fields have changed', function () {
      const parts = this.currentSelections.ticket.parts;
      const partsSaved = this.currentSelections._ticketSaved.parts;
      parts[1].price = 199.99;
      expect(this.currentSelections._isEqual(parts, partsSaved)).toBe(false);
    });

    it('should return true if none of the components are different', function () {
      const parts = this.currentSelections.ticket.parts;
      const partsSaved = this.currentSelections._ticketSaved.parts;
      expect(this.currentSelections._isEqual(parts, partsSaved)).toBe(true);
    });
  });

  describe('save', function () {
    beforeEach(function () {
      this.addComponents();

      spyOn(this.customerResource, 'updateCustomer').and.returnValue(this.$q.resolve());
      spyOn(this.ticketResource, 'updateTicket').and.returnValue(this.$q.resolve());
      spyOn(this.partResource, 'updatePart').and.returnValue(this.$q.resolve());
      spyOn(this.partResource, 'deletePart').and.returnValue(this.$q.resolve());
      spyOn(this.paymentResource, 'updatePayment').and.returnValue(this.$q.resolve());
      spyOn(this.paymentResource, 'deletePayment').and.returnValue(this.$q.resolve());
      spyOn(this.serviceResource, 'updateService').and.returnValue(this.$q.resolve());
      spyOn(this.serviceResource, 'deleteService').and.returnValue(this.$q.resolve());
    });

    it('should return a promise that resolves to undefined if no changes to save', function (done) {
      this.currentSelections.save().then((result) => {
        expect(result).toBeUndefined();
        done();
      });

      this.$scope.$digest();
    });

    it('should call the update functions for the customer, ticket, and all ticket components', function () {
      this.currentSelections.customer.firstName = 'John';
      this.currentSelections.save();

      expect(this.customerResource.updateCustomer).toHaveBeenCalledWith(this.currentSelections.customer);
      expect(this.ticketResource.updateTicket).toHaveBeenCalledWith(this.currentSelections.ticket);

      expect(this.partResource.updatePart.calls.count()).toBe(3);
      expect(this.paymentResource.updatePayment.calls.count()).toBe(3);
      expect(this.serviceResource.updateService.calls.count()).toBe(3);
    });

    it('should call the delete functions for any deleted ticket components', function () {
      this.currentSelections.ticket.parts[0].deleted = true;
      this.currentSelections.ticket.parts[2].deleted = true;

      this.currentSelections.ticket.payments[1].deleted = true;
      this.currentSelections.ticket.payments[2].deleted = true;

      this.currentSelections.ticket.services[0].deleted = true;
      this.currentSelections.ticket.services[1].deleted = true;

      this.currentSelections.save();

      expect(this.partResource.deletePart.calls.count()).toBe(2);
      expect(this.paymentResource.deletePayment.calls.count()).toBe(2);
      expect(this.serviceResource.deleteService.calls.count()).toBe(2);
    });

    it('should return a promise that resolves to true if saving was successful', function (done) {
      this.currentSelections.customer.firstName = 'Paul';
      this.currentSelections.save().then((result) => {
        expect(result).toBe(true);
        done();
      });

      this.$scope.$digest();
    });

    it('should return a promise that rejects if anything fails to save', function (done) {
      this.ticketResource.updateTicket.and.returnValue(this.$q.reject('error'));
      this.currentSelections.customer.firstName = 'George';
      this.currentSelections.save().catch((error) => {
        expect(error).toBe('error');
        done();
      });

      this.$scope.$digest();
    });
  });

  describe('hasUnsavedChanges', function () {
    beforeEach(function () {
      this.addComponents();
    });

    it('should return true if there are any unsaved changes', function () {
      this.currentSelections.ticket.services[1].tech = 'Ringo';
      expect(this.currentSelections.hasUnsavedChanges()).toBe(true);
    });

    it('should return false if there are no unsaved changes', function () {
      expect(this.currentSelections.hasUnsavedChanges()).toBe(false);
    });
  });

  describe('get/set customer', function () {
    it('should return the current customer', function () {
      expect(this.currentSelections.customer).toBe(this.currentSelections._customer);
    });

    it('should set the customer to the new value and update the last saved customer', function () {
      const newCustomer = new this.customerResource.Customer();
      this.currentSelections.customer = newCustomer;

      expect(this.currentSelections.customer).toBe(newCustomer);
      expect(this.currentSelections.customer).toEqual(this.currentSelections._customerSaved);
      expect(this.currentSelections.customer).not.toBe(this.currentSelections._customerSaved);
    });
  });

  describe('get ticket', function () {
    it('should return the current ticket', function () {
      expect(this.currentSelections.ticket).toBe(this.currentSelections._ticket);
    });

    it('should set the ticket to the new value and update the last saved ticket', function () {
      const newTicket = new this.ticketResource.Ticket();
      this.currentSelections.ticket = newTicket;

      expect(this.currentSelections.ticket).toBe(newTicket);
      expect(this.currentSelections.ticket).toEqual(this.currentSelections._ticketSaved);
      expect(this.currentSelections.ticket).not.toBe(this.currentSelections._ticketSaved);
    });
  });
});
