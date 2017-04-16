'use strict';
'ngInject';

angular.module('appliancePointOfSale').component('searchPanel', {
  bindings: {
  },
  controller: function($state, $timeout, customerResource, Customer, snapRemote, ticketResource) {
    this.customers = [];
    this.searchType = 'lastName';
    this.spinnerConfig = { radius: 20, width: 4, length: 8 };

    this.search = () => {
      this.customers = [];

      if (!this.searchText || this.searchText.length < 2) {
        return;
      }

      let promise;
      if (this.searchType === 'phoneNumber') {
        promise = customerResource.fetchByPhoneNumber(this.searchText);
      } else {
        promise = customerResource.fetchByLastName(this.searchText);
      }

      this.showSpinner = true;

      promise.then((results) => {
        this.customers = _.map(results, (result) => new Customer(result));
      }, () => {
        this.error = 'Error while searching';
        $timeout(() => { delete this.error; }, 5000);
      }).finally(() => {
        this.showSpinner = false;
      });
    };

    this.selectCustomer = (customer) => {
      angular.element('#customer-matches button.active').removeClass('active');
      angular.element('#customer-matches #' + customer.id).addClass('active');

      $state.go('customers', { customerId: customer.id });
    };

    this.createNewCustomer = () => {
      angular.element('#customer-matches button.active').removeClass('active');
      snapRemote.close();

      customerResource.createCustomer().then((rawCustomer) => {
        const customer = new Customer(rawCustomer);
        $state.go('customers', { customerId: customer.id });
      });
    };
  },
  templateUrl: 'search-panel/search-panel.tpl.html'
});
