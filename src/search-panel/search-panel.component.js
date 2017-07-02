'use strict';
'ngInject';

angular.module('appliancePointOfSale').component('searchPanel', {
  bindings: {
  },
  controller: function ($state, $timeout, customerResource, snapRemote) {
    this.customers = [];
    this.searchType = 'lastName';
    this.spinnerConfig = { radius: 20, width: 4, length: 8 };
    this.resultType = 'both';  //ticketsOnly / invoicesOnly / both
    this.startSearchDate = '2017-01-01';
    this.endSearchDate = '2099-12-31'; 

    this.setSearchType = (type) => {
      const oldSearchType = this.searchType;

      if (type === 'phoneNumber') {
        this.searchType = 'phoneNumber';
      } else {
        this.searchType = 'lastName';
      }

      if (oldSearchType !== this.searchType) {
        this.searchText = '';
      }
    };

    this.search = () => {
      this.customers = [];

      if (!this.searchText || this.searchText.length < 2) {
        return;
      }

      let promise;
      if (this.searchType === 'phoneNumber') {
        if (this.resultType === 'ticketsOnly') {
          promise = customerResource.fetchByPhoneNumberIfTickets(
              this.searchText, this.startSearchDate, this.endSearchDate);
        } else {
          promise = customerResource.fetchByPhoneNumber(this.searchText);
        }
      } else {
        if (this.resultType === 'ticketsOnly') {
          promise = customerResource.fetchByLastNameIfTickets(
              this.searchText, this.startSearchDate, this.endSearchDate);
        } else {
          promise = customerResource.fetchByLastName(this.searchText);
        }
      }

      this.showSpinner = true;

      promise.then((results) => {
        this.customers = _.sortBy(results, (customer) => customer.lastName + customer.firstName);
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
