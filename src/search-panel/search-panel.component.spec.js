'use strict';

describe('Component: searchPanel', function () {
  beforeEach(module('appliancePointOfSale'));

  beforeEach(inject(function ($componentController, SearchOptions, snapRemote) {
    this.$componentController = $componentController;
    this.SearchOptions = SearchOptions;
    this.snapRemote = snapRemote;

    this.locals = {};
    this.bindings = {};
    this.createController = () => $componentController('searchPanel', this.locals, this.bindings);

    angular.element('body').append([
      '<div id="customer-matches">',
      '<button id="0" class="active"></button>',
      '<button id="1"></button>',
      '</div>',
    ].join(''));

  }));

  it('should setup defaults', function () {
    const ctrl = this.createController();
    expect(ctrl.customers).toEqual(jasmine.any(Array));
    expect(ctrl.spinnerConfig).toEqual(jasmine.any(Object));
    expect(ctrl.searchOptions).toEqual(jasmine.any(this.SearchOptions));
  });

  describe('search', function () {
    beforeEach(inject(function ($q, $rootScope, $timeout, customerResource) {
      this.$q = $q;
      this.$scope = $rootScope.$new();
      this.$timeout = $timeout;
      this.customerResource = customerResource;

      const customers = [];
      for (let i = 4; i >= 0; i--) {
        const customer = new customerResource.Customer({
          firstName: 'FN' + i,
          lastName: 'LN' + i,
        });

        customers.push(customer);
      }

      spyOn(customerResource, 'searchForCustomers').and.returnValue($q.resolve(customers));
    }));

    it('should not attempt to search if searchText is too short', function () {
      const ctrl = this.createController();
      ctrl.search();

      ctrl.searchOptions.searchText = 'J';
      ctrl.search();

      expect(this.customerResource.searchForCustomers).not.toHaveBeenCalled();
    });

    it('should call customerResource#searchForCustomers and sort the results', function () {
      const ctrl = this.createController();
      ctrl.searchOptions.searchText = 'Vecer';
      ctrl.search();

      this.$scope.$digest();

      expect(this.customerResource.searchForCustomers).toHaveBeenCalledWith(ctrl.searchOptions);
      expect(ctrl.customers.length).toBe(5);
      expect(ctrl.customers[0].lastName).toBe('LN0');
    });

    it('should set an error if the request fails and clear it after 5s', function () {
      this.customerResource.searchForCustomers.and.returnValue(this.$q.reject({ status: 500 }));
      const ctrl = this.createController();
      ctrl.searchOptions.searchText = 'aa';
      ctrl.search();

      this.$scope.$digest();

      expect(ctrl.error).toBe('Error while searching');
      this.$timeout.flush();
      expect(ctrl.error).toBeUndefined();
    });

    it('should not set an error if the request was canceled', function () {
      this.customerResource.searchForCustomers.and.returnValue(this.$q.reject({ status: -1 }));
      const ctrl = this.createController();
      ctrl.searchOptions.searchText = 'aa';
      ctrl.search();

      this.$scope.$digest();

      expect(ctrl.error).toBeUndefined();
    });

    it('should show a spinner while the request is pending', function () {
      const ctrl = this.createController();
      ctrl.searchOptions.searchText = 'aa';
      ctrl.search();

      expect(ctrl.showSpinner).toBeTruthy();

      this.$scope.$digest();

      expect(ctrl.showSpinner).toBeFalsy();
    });
  });

  describe('openAdvancedSearch', function () {
    it('should open the advanced search modal', inject(function ($uibModal) {
      spyOn($uibModal, 'open');
      const ctrl = this.createController();

      ctrl.openAdvancedSearch();

      expect($uibModal.open).toHaveBeenCalledWith(jasmine.objectContaining({ component: 'advancedSearch' }));
    }));
  });

  describe('selectCustomer', function () {
    beforeEach(inject(function ($state) {
      this.$state = $state;
      spyOn($state, 'go');
    }));

    it('should remove the active class and add it to the selected customer', function () {
      const ctrl = this.createController();
      ctrl.selectCustomer({ id: '1' });
      expect(angular.element('#0').hasClass('active')).toBeFalsy();
      expect(angular.element('#1').hasClass('active')).toBeTruthy();
    });

    it('should change to the customers state with the selected id', function () {
      const ctrl = this.createController();
      ctrl.selectCustomer({ id: '1' });
      expect(this.$state.go).toHaveBeenCalledWith('customers', { customerId: '1' });
    });
  });

  describe('createNewCustomer', function () {
    beforeEach(inject(function ($state) {
      this.$state = $state;
      spyOn($state, 'go');
    }));

    it('should remove the active class from a selected customer', function () {
      const ctrl = this.createController();
      ctrl.createNewCustomer();
      expect(angular.element('#0').hasClass('active')).toBeFalsy();
    });

    it('should change to the customers state with the customerId empty', function () {
      const ctrl = this.createController();
      ctrl.createNewCustomer();
      expect(this.$state.go).toHaveBeenCalledWith('customers', { customerId: '' });
    });
  });

  describe('openTicket', function () {
    beforeEach(inject(function ($state, snapRemote) {
      this.$state = $state;
      this.snapRemote = snapRemote;
      spyOn($state, 'go');
      spyOn(snapRemote, 'close');
    }));

    it('should only open the ticket by keypress on enter', function () {
      const ctrl = this.createController();
      ctrl.ticketId = '1234';
      ctrl.openTicket({ which: 14 });
      expect(this.$state.go).not.toHaveBeenCalled();

      ctrl.openTicket({ which: 13 });
      expect(this.$state.go).toHaveBeenCalled();
    });

    it('should not attempt to open a ticket without a ticketId', function () {
      const ctrl = this.createController();
      ctrl.openTicket();
      expect(this.$state.go).not.toHaveBeenCalled();
    });

    it('should remove the active class from a selected customer', function () {
      const ctrl = this.createController();
      ctrl.ticketId = '1234';
      ctrl.openTicket();
      expect(angular.element('#0').hasClass('active')).toBeFalsy();
    });

    it('should clear the ticketId when opening a ticket', function () {
      const ctrl = this.createController();
      ctrl.ticketId = '1234';
      ctrl.openTicket();
      expect(ctrl.ticketId).toBe('');
    });

    it('should close the snap panel when opening a ticket', function () {
      const ctrl = this.createController();
      ctrl.ticketId = '1234';
      ctrl.openTicket();
      expect(this.snapRemote.close).toHaveBeenCalled();
    });

    it('should change to the tickets state with the ticketId', function () {
      const ctrl = this.createController();
      ctrl.ticketId = '1234';
      ctrl.openTicket();
      expect(this.$state.go).toHaveBeenCalledWith('tickets', { ticketId: '1234' });
    });
  });
});
