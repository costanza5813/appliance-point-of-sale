'use strict';
'ngInject';

const baseUri = '/ShoreTVCustomers/ServiceTickets/customers/';

class CustomerResource {
  constructor($http, $q, Customer) {
    this.$http = $http;
    this.$q = $q;
    this.Customer = Customer;
  }

  fetchByLastName(lastName) {
    if (!lastName) {
      return this.$q.resolve([]);
    }

    return this.$http.get(baseUri + 'search/by-lastNameStartingWithIgnoreCase', { params: { lastName: lastName }})
      .then((response) => _.get(response, 'data._embedded.customers', []));
  }

  fetchByPhoneNumber(phoneNumber) {
    if (!phoneNumber) {
      return this.$q.resolve([]);
    }

    return this.$http.get(baseUri + 'search/by-phoneNumberStartingWithIgnoreCase', { params: { phoneNumber: phoneNumber }})
      .then((response) => _.get(response, 'data._embedded.customers', []));
  }

  fetchCustomer(id) {
    //return this.$http.get(baseUri + id).then((response) => response.data);

    return this.$http.get(baseUri + id).then((response) => {
      _.set(response.data._links, 'tickets.href', 'http://localhost:8888/ShoreTVCustomers/ServiceTickets/customers/1/tickets');
      return response.data;
    });
  }

  createCustomer() {
    return this.$http.post(baseUri, this.Customer.defaults).then((response) => response.data);
  }

  updateCustomer(customer) {
    return this.$http.put(customer.selfHref, customer.rawData);
  }
}

angular.module('appliancePointOfSale').factory('customerResource', CustomerResource);
