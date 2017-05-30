'use strict';
'ngInject';

angular.module('appliancePointOfSale').component('searchPanel', {
  bindings: {
  },
  controller: function($state, $timeout, customerResource, Customer, snapRemote, ticketResource) {
    this.customers = [];
    this.searchType = 'lastName';
    this.spinnerConfig = { radius: 20, width: 4, length: 8 };

    this.setSearchType = (type) => {
      if (type === 'phoneNumber') {
        this.searchType = 'phoneNumber';
      } else {
        this.searchType = 'lastName';
      }

      this.searchText = '';
    };

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
        this.customers = _.chain(results)
          .map((result) => new Customer(result))
          .sortBy((customer) => customer.lastName + customer.firstName)
          .value();
      }, (reject) => {
        if (reject.status >= 0) {
          this.error = 'Error while searching';
          $timeout(() => { delete this.error; }, 5000);
        }
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

      $state.go('customers');
    };

    this.openTicket = (keyEvent) => {
      if (keyEvent && keyEvent.which !== 13) {
        return;
      }

      if (this.ticketId) {
        const ticketId = this.ticketId;
        this.ticketId = '';
        snapRemote.close();

        $state.go('tickets', { ticketId: ticketId });
      }
    };
  },
  templateUrl: 'search-panel/search-panel.tpl.html'
});
