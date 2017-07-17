'use strict';
'ngInject';

angular.module('appliancePointOfSale').component('searchPanel', {
  bindings: {
  },
  controller: function ($state, $timeout, $uibModal, customerResource, SearchOptions, snapRemote) {
    this.customers = [];
    this.spinnerConfig = { radius: 20, width: 4, length: 8 };

    this.search = () => {
      this.customers = [];

      if (_.size(this.searchOptions.searchText) < 2) {
        return;
      }

      this.showSpinner = true;

      customerResource.searchForCustomers(this.searchOptions).then((results) => {
        this.customers = _.chain(results)
          .filter((customer) => !_.isEmpty(customer.lastName))
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

    this.searchOptions = new SearchOptions({}, this.search.bind(this));

    this.openAdvancedSearch = () => {
      const modalOptions = {
        size: 'sm',
        component: 'advancedSearch',
        resolve: {
          searchOptions: () => {
            return this.searchOptions;
          },
        },
      };

      $uibModal.open(modalOptions);
    };

    this.selectCustomer = (customer) => {
      angular.element('#customer-matches button.active').removeClass('active');
      angular.element('#customer-matches #' + customer.id).addClass('active');

      $state.go('customers', { customerId: customer.id });
    };

    this.createNewCustomer = () => {
      angular.element('#customer-matches button.active').removeClass('active');
      snapRemote.close();

      $state.go('customers', { customerId: '' });
    };

    this.openTicket = (keyEvent) => {
      if (keyEvent && keyEvent.which !== 13) {
        return;
      }

      if (this.ticketId) {
        angular.element('#customer-matches button.active').removeClass('active');
        const ticketId = this.ticketId;
        this.ticketId = '';
        snapRemote.close();

        $state.go('tickets', { ticketId: ticketId });
      }
    };
  },

  templateUrl: 'search-panel/search-panel.tpl.html',
});
