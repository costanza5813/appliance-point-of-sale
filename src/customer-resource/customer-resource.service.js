'use strict';
'ngInject';

const baseUri = '/ShoreTVCustomers/ServiceTickets/customers/';

class CustomerResource {
  constructor($http, $q, Customer) {
    this.$http = $http;
    this.$q = $q;
    this.Customer = Customer;

    this.abortDeferred = $q.defer();
  }

  fetchByLastName(lastName) {
    if (!lastName) {
      return this.$q.resolve([]);
    }

    this.abortDeferred.resolve();
    this.abortDeferred = this.$q.defer();

    return this.$http.get(baseUri + 'search/by-lastNameStartingWithIgnoreCase',
                          { params: { lastName: lastName }, timeout: this.abortDeferred.promise })
      .then((response) => _.get(response.data, '_embedded.customers', []));
  }

  fetchByPhoneNumber(phoneNumber) {
    if (!phoneNumber) {
      return this.$q.resolve([]);
    }

    this.abortDeferred.resolve();
    this.abortDeferred = this.$q.defer();

    return this.$http.get(baseUri + 'search/by-phoneNumberStartingWithIgnoreCase',
                          { params: { phoneNumber: phoneNumber }, timeout: this.abortDeferred.promise })
      .then((response) => _.get(response.data, '_embedded.customers', []));
  }

  fetchCustomer(id) {
    return this.$http.get(baseUri + id).then((response) => {
      _.set(response.data, '_links.tickets.href', ('/ShoreTVCustomers/ServiceTickets/customerTickets/' + id));
      return new this.Customer(response.data);
    });
  }

  fetchCustomerForTicket(ticket) {
    return this.$http.get(ticket.customerHref).then((response) => new this.Customer(response.data));
  }

  createCustomer() {
    return this.$http.post(baseUri, this.Customer.defaults).then((response) => new this.Customer(response.data));
  }

  updateCustomer(customer) {
    return this.$http.put(customer.selfHref, customer.rawData);
  }
}

angular.module('appliancePointOfSale').service('customerResource', CustomerResource);
