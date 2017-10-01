'use strict';
'ngInject';

angular.module('appliancePointOfSale').component('searchPanel', {
  bindings: {
  },
  controller: function ($element, $state, $timeout, $uibModal, customerResource, SearchOptions, snapRemote) {
    this.customers = [];
    this.spinnerConfig = { radius: 20, width: 4, length: 8 };
    this.selectedCustomer = null;
    this.jumpType = 'ticket';

    this.setJumpType = (type) => {
      if (type === 'purchase') {
        this.jumpType = type;
      } else {
        this.jumpType = 'ticket';
      }

      $element.find('#jump-input').focus();
    };

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

    this.createNewCustomer = () => {
      const modalOptions = {
        backdrop: 'static',
        keyboard: false,
        component: 'confirmContext',
      };

      $uibModal.open(modalOptions).result.then((choice) => {
        this.selectedCustomer = null;
        snapRemote.close();

        if (choice === 'purchase') {
          $state.go('customerPurchases', { customerId: '' });
        } else {
          $state.go('customerTickets', { customerId: '' });
        }
      });
    };

    this.openCustomerPurchases = () => {
      $state.go('customerPurchases', { customerId: this.selectedCustomer.id });
    };

    this.openCustomerTickets = () => {
      $state.go('customerTickets', { customerId: this.selectedCustomer.id });
    };

    this.jump = (keyEvent) => {
      if (keyEvent && keyEvent.which !== 13) {
        return;
      }

      if (this.jumpId) {
        this.selectedCustomer = null;
        const jumpId = this.jumpId;
        this.jumpId = '';
        snapRemote.close();

        if (this.jumpType === 'purchase') {
          $state.go('purchases', { purchaseId: jumpId });
        } else {
          $state.go('tickets', { ticketId: jumpId });
        }
      }
    };
  },

  templateUrl: 'search-panel/search-panel.tpl.html',
});
