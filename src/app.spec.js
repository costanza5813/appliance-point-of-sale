'use strict';

describe('Module: appliancePointOfSale', function () {
  beforeEach(module('appliancePointOfSale'));

  beforeEach(inject(function ($q, $rootScope, $state, customerResource, ticketResource) {
    this.$q = $q;
    this.$scope = $rootScope.$new();
    this.$state = $state;

    // this.Customer = customerResource.Customer;
    // this.Ticket = ticketResource.Ticket;

    this.customerResource = customerResource;
    this.ticketResource = ticketResource;

    this.customer = new customerResource.Customer();
    this.ticket = new ticketResource.Ticket();

    spyOn(customerResource, 'fetchCustomer').and.returnValue($q.resolve(this.customer));
    spyOn(customerResource, 'fetchCustomerForTicket').and.returnValue($q.resolve(this.customer));
    spyOn(customerResource, 'createCustomer').and.returnValue($q.resolve(this.customer));
    spyOn(ticketResource, 'fetchTicket').and.returnValue($q.resolve(this.ticket));
    spyOn(ticketResource, 'fetchTicketsForCustomer').and.returnValue($q.resolve([this.ticket]));
    spyOn(ticketResource, 'createTicketForCustomer').and.returnValue($q.resolve(this.ticket));
  }));

  describe('customers resolve', function () {
    it('should fetch the customer and tickets for the provided customerId', function () {
      this.$state.go('customers', { customerId: '123' });
      this.$scope.$digest();

      expect(this.customerResource.fetchCustomer).toHaveBeenCalledWith('123');
      expect(this.ticketResource.fetchTicketsForCustomer).toHaveBeenCalledWith(this.customer);
      expect(this.customer.tickets[0]).toBe(this.ticket);
      expect(this.$state.current.name).toBe('customers');
    });

    it('should fetch the customer and create a new ticket if none exist', function () {
      this.ticketResource.fetchTicketsForCustomer.and.returnValue(this.$q.resolve([]));
      this.$state.go('customers', { customerId: '123' });
      this.$scope.$digest();

      expect(this.ticketResource.createTicketForCustomer).toHaveBeenCalledWith(this.customer);
      expect(this.customer.tickets[0]).toBe(this.ticket);
      expect(this.$state.current.name).toBe('customers');
    });

    it('should handle a failed request and route to the error state', function () {
      this.customerResource.fetchCustomer.and.returnValue(this.$q.reject());
      this.$state.go('customers', { customerId: '123' });
      this.$scope.$digest();

      expect(this.$state.current.name).toBe('error');
    });

    it('should create a new customer if a customerId is not provided', function () {
      this.$state.go('customers', { customerId: '' });
      this.$scope.$digest();

      expect(this.customerResource.createCustomer).toHaveBeenCalled();
      expect(this.ticketResource.createTicketForCustomer).toHaveBeenCalledWith(this.customer);
    });
  });

  describe('tickets resolve', function () {
    it('should fetch the ticket and customer for the provided ticketId', function () {
      this.$state.go('tickets', { ticketId: '123' });
      this.$scope.$digest();

      expect(this.ticketResource.fetchTicket).toHaveBeenCalledWith('123');
      expect(this.customerResource.fetchCustomerForTicket).toHaveBeenCalledWith(this.ticket);
      expect(this.customer.tickets[0]).toBe(this.ticket);
      expect(this.$state.current.name).toBe('tickets');
    });

    it('should handle a missing ticketId', function () {
      this.$state.go('tickets', { ticketId: '' });
      this.$scope.$digest();

      expect(this.$state.current.name).toBe('error');
    });

    it('should handle a failed request and route to the error state', function () {
      this.ticketResource.fetchTicket.and.returnValue(this.$q.reject());
      this.$state.go('tickets', { ticketId: '123' });
      this.$scope.$digest();

      expect(this.$state.current.name).toBe('error');
    });
  });

  describe('error resolve', function () {
    it('should use a default error description if none is provided', function () {
      this.$state.go('error', { description: '' });
      this.$scope.$digest();
      expect(this.$state.current.name).toBe('error');
    });
  });

  describe('unsaved changes warning', function () {
    beforeEach(inject(function ($uibModal, currentSelections, spinnerHandler) {
      this.$uibModal = $uibModal;
      this.currentSelections = currentSelections;
      this.spinnerHandler = spinnerHandler;

      this.saveDeferred = this.$q.defer();

      spyOn($uibModal, 'open').and.returnValue({ result: this.$q.resolve() });
      spyOn(currentSelections, 'hasUnsavedChanges').and.returnValue(true);
      spyOn(currentSelections, 'save').and.returnValue(this.saveDeferred.promise);
    }));

    it('should launch the modal confirm dialog if unsaved changes exist', function () {
      this.$state.go('customers', { customerId: '123' });
      this.$scope.$digest();

      this.$state.go('welcome');
      this.$scope.$digest();
      expect(this.$uibModal.open).toHaveBeenCalledWith(jasmine.any(Object));
      expect(this.spinnerHandler.show).toBe(true);
    });

    it('should save the changes if the user accepts the modal', function () {
      this.$state.go('customers', { customerId: '123' });
      this.$scope.$digest();

      this.$state.go('welcome');
      this.saveDeferred.resolve();
      this.$scope.$digest();
      expect(this.currentSelections.save).toHaveBeenCalled();
      expect(this.spinnerHandler.show).toBe(false);
    });

    it('should not save the changes if the user rejects the modal', function () {
      this.$state.go('customers', { customerId: '123' });
      this.$scope.$digest();

      this.$uibModal.open.and.returnValue({ result: this.$q.reject() });

      this.$state.go('welcome');
      this.$scope.$digest();
      expect(this.currentSelections.save).not.toHaveBeenCalled();
    });
  });

  describe('onbeforeunload', function () {
    beforeEach(inject(function ($window, currentSelections) {
      this.$window = $window;
      this.currentSelections = currentSelections;
      spyOn(currentSelections, 'hasUnsavedChanges').and.returnValue(true);
    }));

    it('should return a string if there are unsaved changes', function () {
      this.$state.go('customers', { customerId: '123' });
      this.$scope.$digest();

      expect(this.$window.onbeforeunload()).toBe('unsaved changes');
    });

    it('should return undefined if there are no changes to save', function () {
      this.$state.go('customers', { customerId: '123' });
      this.$scope.$digest();

      this.currentSelections.hasUnsavedChanges.and.returnValue(false);

      expect(this.$window.onbeforeunload()).toBeUndefined();
    });
  });
});
