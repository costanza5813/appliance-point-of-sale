'use strict';
'ngInject';

angular.module('appliancePointOfSale').component('searchPanel', {
    bindings: {
    },
    controller: function($timeout, customerSelection, snapRemote) {
        this.results = [];
        this.searchType = 'lastName';
        this.spinnerConfig = { radius: 20, width: 4, length: 8 };

        this.search = () => {
            this.results = [];

            if (!this.searchText) {
                return;
            }

            let promise;
            if (this.searchType === 'phoneNumber') {
                promise = customerSelection.searchByPhoneNumber(this.searchText);
            } else {
                promise = customerSelection.searchByLastName(this.searchText);
            }

            this.showSpinner = true;

            promise.then((results) => {
                this.results = results;
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

            customerSelection.current = customer;
        };

        this.createNewCustomer = () => {
            angular.element('#customer-matches button.active').removeClass('active');
            customerSelection.current = undefined;
            snapRemote.close();
        };

        this.isNewCustomer = () => {
            return customerSelection.current.id === '%new%';
        };
    },
    templateUrl: 'search-panel/search-panel.tpl.html'
});
