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
    beforeEach(inject(function ($httpBackend, $q, $rootScope, $window, currentSelections, Customer, Part, Payment,
                                Service, Ticket) {
      this.$httpBackend = $httpBackend;
      this.$q = $q;
      this.$scope = $rootScope.$new();
      this.currentSelections = currentSelections;

      currentSelections.customer = new Customer();
      currentSelections.ticket = new Ticket();

      currentSelections.ticket.addPart(new Part());
      currentSelections.ticket.addPayment(new Payment());
      currentSelections.ticket.addService(new Service());

      spyOn(currentSelections, 'save').and.returnValue(this.$q.resolve());
      spyOn($window, 'open');
    }));

    it('should show the spinner until the promises resolve', inject(function (spinnerHandler) {
      const ctrl = this.createController();

      ctrl.printTicket();

      expect(spinnerHandler.show).toBeTruthy();
      this.$scope.$digest();
      expect(spinnerHandler.show).toBeFalsy();
    }));

    it('should call save on the current selections', function () {
      const ctrl = this.createController();
      _.set(this.currentSelections.ticket.rawData, '_links.self.href', '/');
      ctrl.printTicket();
      expect(this.currentSelections.save).toHaveBeenCalled();
    });

    it('should open the response pdf in a new tab', function () {
      const ctrl = this.createController();
      _.set(this.currentSelections.ticket.rawData, '_links.self.href', '/555');
      ctrl.printTicket();
      this.$scope.$digest();

      expect(window.open).toHaveBeenCalledWith(
        '/ShoreTVCustomers/ServiceTickets/printable-ticket/555?hideCustomerTotals=true',
        '_blank'
      );
    });

    it('should correctly send the hideCustomerTotals flag', function () {
      const ctrl = this.createController();
      _.set(this.currentSelections.ticket.rawData, '_links.self.href', '/555');
      ctrl.hideCustomerTotals = false;
      ctrl.printTicket();
      this.$scope.$digest();

      expect(window.open).toHaveBeenCalledWith(
        '/ShoreTVCustomers/ServiceTickets/printable-ticket/555?hideCustomerTotals=false',
        '_blank'
      );
    });
  });
});
