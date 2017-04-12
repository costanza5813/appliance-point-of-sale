'use strict';
'ngInject';

const injected = {};
const newCustomerId = '%new-customer%';

class Customer {
  constructor(id, lastName, firstName) {
    this._id = id || newCustomerId;
    this._lastName = lastName || '';
    this._firstName = firstName || '';
  }

  isNewCustomer() {
    return this._id === newCustomerId;
  }

  get id() {
    return this._id;
  }

  get lastName() {
    return this._lastName;
  }

  get firstName() {
    return this._firstName;
  }
}

class CustomerSelection {
  constructor($q, $timeout) {
    injected.$q = $q;
    injected.$timeout = $timeout;

    this._current = new Customer();
  }

  searchByLastName(lastName) {
    angular.noop(lastName);
    const deferred = injected.$q.defer();

    injected.$timeout(() => {
      const customers = [
        new Customer('0', 'Johnson', 'Kevin'),
        new Customer('1', 'Vece', 'Mike'),
      ];

      for (let i = 0; i < 10; i++) {
        customers.push(new Customer('' + (i+2), 'lastName' + (i+2), 'firstName' + (i+2)));
      }
      deferred.resolve(customers);
    }, 500);

    return deferred.promise;
  }

  searchByPhoneNumber(phoneNumber) {
    angular.noop(phoneNumber);
    const deferred = injected.$q.defer();

    injected.$timeout(() => {
      deferred.reject();
    }, 2000);

    return deferred.promise;
  }

  createNewCustomer() {
    this._current = new Customer();
  }

  get current() {
    return this._current;
  }

  set current(customer) {
    this._current = customer || new Customer();
  }
}

angular.module('appliancePointOfSale').factory('customerSelection', CustomerSelection);
