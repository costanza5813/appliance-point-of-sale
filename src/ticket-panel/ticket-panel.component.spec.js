'use strict';

describe('Component: ticketPanel', function () {
  beforeEach(module('appliancePointOfSale'));

  beforeEach(inject(function ($componentController, $q, currentSelections, Customer, spinnerHandler, ticketResource) {
    this.$componentController = $componentController;
    this.currentSelections = currentSelections;
    this.spinnerHandler = spinnerHandler;
    this.ticketResource = ticketResource;

    this.customer = new Customer();
    this.customer.addTicket(new ticketResource.Ticket());

    this.locals = {
      typeaheadOptions: {
        salespeople: $q.resolve(['John', 'Paul', 'George', 'Ringo']),
      },
    };
    this.bindings = { customer: this.customer };
    this.createController = () => $componentController('ticketPanel', this.locals, this.bindings);
  }));

  it('should setup defaults', function () {
    const ctrl = this.createController();
    expect(ctrl.spinnerHandler).toBe(this.spinnerHandler);
    expect(this.spinnerHandler.show).toBeTruthy();
  });

  it('should get the salespeople list from the typeaheadOptions service', inject(function ($rootScope) {
    const ctrl = this.createController();
    $rootScope.$new().$digest();
    expect(ctrl.salespeople).toEqual(jasmine.any(Array));
    expect(ctrl.salespeople.length).toBe(4);
  }));

  describe('$onInit', function () {
    beforeEach(inject(function ($q, $rootScope, partResource, paymentResource, serviceResource) {
      this.$scope = $rootScope.$new();
      this.partResource = partResource;
      this.paymentResource = paymentResource;
      this.serviceResource = serviceResource;

      spyOn(partResource, 'fetchPartsForTicket').and.returnValue($q.resolve([new partResource.Part()]));
      spyOn(paymentResource, 'fetchPaymentsForTicket').and.returnValue($q.resolve([new paymentResource.Payment()]));
      spyOn(serviceResource, 'fetchServicesForTicket').and.returnValue($q.resolve([new serviceResource.Service()]));
    }));

    it('should set currentSelections customer', function () {
      const ctrl = this.createController();
      ctrl.$onInit();
      expect(this.currentSelections.customer).toBe(ctrl.customer);
    });

    it('should set the paginationIndex to the last ticket index', function () {
      const ctrl = this.createController();
      ctrl.$onInit();
      expect(ctrl.paginationIndex).toBe(1);
    });

    it('should fetch the parts, payments, and services for the ticket', function () {
      const ctrl = this.createController();
      ctrl.$onInit();
      expect(this.partResource.fetchPartsForTicket).toHaveBeenCalledWith(ctrl.customer.tickets[0]);
      expect(this.paymentResource.fetchPaymentsForTicket).toHaveBeenCalledWith(ctrl.customer.tickets[0]);
      expect(this.serviceResource.fetchServicesForTicket).toHaveBeenCalledWith(ctrl.customer.tickets[0]);
    });

    it('should add the parts, payments, and services to the ticket', function () {
      const ctrl = this.createController();
      ctrl.$onInit();
      this.$scope.$digest();
      expect(this.customer.tickets[0].parts.length).toBe(1);
      expect(this.customer.tickets[0].payments.length).toBe(1);
      expect(this.customer.tickets[0].services.length).toBe(1);
    });

    it('should set currentSelections ticket', function () {
      const ctrl = this.createController();
      ctrl.$onInit();
      this.$scope.$digest();
      expect(this.currentSelections.ticket).toBe(ctrl.customer.tickets[0]);
      expect(ctrl.currentTicket).toBe(ctrl.customer.tickets[0]);
    });

    it('should hide the spinner after all requests have resolved', function () {
      const ctrl = this.createController();
      ctrl.$onInit();
      this.$scope.$digest();
      expect(this.spinnerHandler.show).toBeFalsy();
    });
  });

  describe('changeTicket', function () {
    it('should update currentSelections ticket', function () {
      const ctrl = this.createController();
      ctrl.customer.addTicket(new this.ticketResource.Ticket());
      ctrl.paginationIndex = 2;
      ctrl.changeTicket();

      expect(this.currentSelections.ticket).toBe(ctrl.customer.tickets[1]);
      expect(ctrl.currentTicket).toBe(ctrl.customer.tickets[1]);
    });
  });

  describe('createNewTicket', function () {
    beforeEach(inject(function ($q, $rootScope) {
      this.$scope = $rootScope.$new();
      spyOn(this.ticketResource, 'createTicketForCustomer')
        .and.returnValue($q.resolve(new this.ticketResource.Ticket()));
    }));

    it('should call createTicketForCustomer', function () {
      const ctrl = this.createController();
      ctrl.createNewTicket();
      expect(this.ticketResource.createTicketForCustomer).toHaveBeenCalledWith(ctrl.customer);
    });

    it('should add the new ticket to the customer', function () {
      const ctrl = this.createController();
      ctrl.createNewTicket();
      this.$scope.$digest();
      expect(ctrl.customer.tickets.length).toBe(2);
    });

    it('should update the paginationIndex', function () {
      const ctrl = this.createController();
      ctrl.createNewTicket();
      this.$scope.$digest();
      expect(ctrl.paginationIndex).toBe(2);
    });

    it('should update currentSelections ticket', function () {
      const ctrl = this.createController();
      ctrl.createNewTicket();
      this.$scope.$digest();

      expect(this.currentSelections.ticket).toBe(ctrl.customer.tickets[1]);
      expect(ctrl.currentTicket).toBe(ctrl.customer.tickets[1]);
    });
  });
});
