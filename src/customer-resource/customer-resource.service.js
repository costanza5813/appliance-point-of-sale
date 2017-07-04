'use strict';
'ngInject';

const baseUri = '/ShoreTVCustomers/ServiceTickets/customers/';
const searchBaseUri = '/ShoreTVCustomers/ServiceTickets/customerSearch/';

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
      .then((response) => {
        const rawCustomers = _.get(response.data, '_embedded.customers', []);
        return _.map(rawCustomers, (rawCustomer) => new this.Customer(rawCustomer));
      });
  }
  
  fetchByLastNameIfTickets(lastName, startDate, endDate) {
    if (!lastName || !startDate || !endDate) {
      return this.$q.resolve([]);
    }

    this.abortDeferred.resolve();
    this.abortDeferred = this.$q.defer();

    //eg: http://localhost:9084/customerSearch/by-lastNameStartingWithIgnoreCase?
      //lastName=Vec&startDate=2015-01-01&endDate=2019-01-01
    //eg: http://localhost:9090/ShoreTVCustomers/ServiceTickets/customerSearch
      // /by-lastNameStartingWithIgnoreCase?lastName=Vec&startDate=2015-01-01&endDate=2019-01-01
    return this.$http.get(searchBaseUri + 'by-lastNameStartingWithIgnoreCase',
        { params: { lastName: lastName, startDate: startDate, endDate: endDate }, timeout: this.abortDeferred.promise })
      .then((response) => {
        const rawCustomers = _.get(response.data, '_embedded.customers', []);
        return _.map(rawCustomers, (rawCustomer) => new this.Customer(rawCustomer));
      });
  }

  fetchByPhoneNumber(phoneNumber) {
    if (!phoneNumber) {
      return this.$q.resolve([]);
    }

    this.abortDeferred.resolve();
    this.abortDeferred = this.$q.defer();

    return this.$http.get(baseUri + 'search/by-phoneNumberStartingWithIgnoreCase',
                          { params: { phoneNumber: phoneNumber }, timeout: this.abortDeferred.promise })
      .then((response) => {
        const rawCustomers = _.get(response.data, '_embedded.customers', []);
        return _.map(rawCustomers, (rawCustomer) => new this.Customer(rawCustomer));
      });
  }
  
  fetchByPhoneNumberIfTickets(phoneNumber, startDate, endDate) {
    if (!phoneNumber || !startDate || !endDate) {
      return this.$q.resolve([]);
    }

    this.abortDeferred.resolve();
    this.abortDeferred = this.$q.defer();
    
    //eg: http://localhost:9084/customerSearch/by-phoneNumberStartingWithIgnoreCase?
      //phoneNumber=669&startDate=2015-01-01&endDate=2019-01-01
    //eg: http://localhost:9090/ShoreTVCustomers/ServiceTickets/customerSearch
      // /by-phoneNumberStartingWithIgnoreCase?phoneNumber=669&startDate=2015-01-01&endDate=2019-01-01
    return this.$http.get(searchBaseUri + 'by-phoneNumberStartingWithIgnoreCase',
        { params: { 
            phoneNumber: phoneNumber, 
            startDate: startDate, 
            endDate: endDate 
          }, timeout: this.abortDeferred.promise 
        })
      .then((response) => {
        const rawCustomers = _.get(response.data, '_embedded.customers', []);
        return _.map(rawCustomers, (rawCustomer) => new this.Customer(rawCustomer));
      });
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
