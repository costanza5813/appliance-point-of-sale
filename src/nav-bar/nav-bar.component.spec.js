'use strict';

describe('Component: navBar', function () {
  beforeEach(module('appliancePointOfSale'));

  beforeEach(inject(function ($componentController, snapRemote) {
    this.$componentController = $componentController;
    this.snapRemote = snapRemote;

    this.locals = {};
    this.bindings = {};
    this.createController = () => {
      const ctrl = $componentController('navBar', this.locals, this.bindings);
      return ctrl;
    };
  }));

  it('should default hideCustomerTotals to true', function () {
    const ctrl = this.createController();
    expect(ctrl.hideCustomerTotals).toBe(true);
  });

  describe('toggleSnap', function () {
    it('should toggle the left snap panel', function () {
      spyOn(this.snapRemote, 'toggle');
      const ctrl = this.createController();
      ctrl.toggleSnap();
      expect(this.snapRemote.toggle).toHaveBeenCalledWith('left');
    });
  });

  describe('saveCustomer', function () {
    it('should show the spinner during save', inject(function ($q, $rootScope, currentSelections, spinnerHandler) {
      spyOn(currentSelections, 'save').and.returnValue($q.resolve());

      const ctrl = this.createController();
      ctrl.saveCustomer();

      expect(spinnerHandler.show).toBeTruthy();
      $rootScope.$new().$digest();
      expect(spinnerHandler.show).toBeFalsy();
    }));
  });

  describe('disableControls', function () {
    it('should return true if the the state is not savable or printable', inject(function ($state) {
      const ctrl = this.createController();
      expect(ctrl.disableControls()).toBeTruthy();

      $state.current.name = 'customers';
      expect(ctrl.disableControls()).toBeFalsy();

      $state.current.name = 'tickets';
      expect(ctrl.disableControls()).toBeFalsy();
    }));
  });

  describe('printTicket', function () {
    beforeEach(inject(function ($httpBackend, $q, $window, currentSelections, Customer, Part, Payment, Service,
                                Ticket) {
      this.$httpBackend = $httpBackend;
      this.$q = $q;
      this.currentSelections = currentSelections;

      currentSelections.customer = new Customer();
      currentSelections.ticket = new Ticket();

      currentSelections.ticket.addPart(new Part());
      currentSelections.ticket.addPayment(new Payment());
      currentSelections.ticket.addService(new Service());

      spyOn(currentSelections, 'save').and.returnValue(this.$q.resolve());
      spyOn($window, 'open');

      this.hideCustomerTotals = true;
      this.expectInvoicePOST = (response) => {
        const payload = {
          customer: currentSelections.customer.rawData,
          ticket: _.chain(currentSelections.ticket.rawData).cloneDeep().assign({
            hideCustomerTotals: this.hideCustomerTotals,
            id: currentSelections.ticket.id || '',
            parts: _.map(currentSelections.ticket.parts, (part) => part.rawData),
            payments: _.map(currentSelections.ticket.payments, (payment) => payment.rawData),
            serviceCalls: _.map(currentSelections.ticket.services, (service) => service.rawData),
          }).value(),
        };

        $httpBackend.expectPOST('/ShoreTVCustomers/ServiceTickets/invoice', payload).respond(response);
      };
    }));

    it('should show the spinner until the promises resolve', inject(function (spinnerHandler) {
      const ctrl = this.createController();

      this.hideCustomerTotals = ctrl.hideCustomerTotals;
      this.expectInvoicePOST();

      ctrl.printTicket();

      expect(spinnerHandler.show).toBeTruthy();
      this.$httpBackend.flush();
      expect(spinnerHandler.show).toBeFalsy();
    }));

    it('should call save on the current selections', function () {
      const ctrl = this.createController();
      _.set(this.currentSelections.ticket.rawData, '_links.self.href', '/');
      this.expectInvoicePOST();
      ctrl.printTicket();
      expect(this.currentSelections.save).toHaveBeenCalled();
    });

    it('should POST the customer and ticket data and open the response pdf id', function () {
      const ctrl = this.createController();
      this.expectInvoicePOST({ invoiceId: '123abc' });
      ctrl.printTicket();
      this.$httpBackend.flush();
      expect(window.open).toHaveBeenCalledWith('/ShoreTVCustomers/ServiceTickets/invoice/123abc', '_blank');
    });

    it('should correctly send the hideCustomerTotals flag', function () {
      const ctrl = this.createController();
      this.hideCustomerTotals = ctrl.hideCustomerTotals = false;
      this.expectInvoicePOST();
      ctrl.printTicket();
    });
  });
});
