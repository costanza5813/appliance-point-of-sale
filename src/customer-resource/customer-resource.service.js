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

  _fetchByLastName(lastName) {
    return this.$http.get(baseUri + 'search/by-lastNameStartingWithIgnoreCase', {
      params: { lastName },
      timeout: this.abortDeferred.promise,
    });
  }

  _fetchByLastNameIfTickets(lastName, startDate, endDate) {
    //eg: http://localhost:9084/customerSearch/by-lastNameStartingWithIgnoreCase?
    //lastName=Vec&startDate=2015-01-01&endDate=2019-01-01
    //eg: http://localhost:9090/ShoreTVCustomers/ServiceTickets/customerSearch
    // /by-lastNameStartingWithIgnoreCase?lastName=Vec&startDate=2015-01-01&endDate=2019-01-01
    return this.$http.get(searchBaseUri + 'by-lastNameStartingWithIgnoreCase', {
      params: { lastName, startDate, endDate },
      timeout: this.abortDeferred.promise,
    });
  }

  _fetchByPhoneNumber(phoneNumber) {
    return this.$http.get(baseUri + 'search/by-phoneNumberStartingWithIgnoreCase', {
      params: { phoneNumber },
      timeout: this.abortDeferred.promise,
    });
  }

  _fetchByPhoneNumberIfTickets(phoneNumber, startDate, endDate) {
    //eg: http://localhost:9084/customerSearch/by-phoneNumberStartingWithIgnoreCase?
    //phoneNumber=669&startDate=2015-01-01&endDate=2019-01-01
    //eg: http://localhost:9090/ShoreTVCustomers/ServiceTickets/customerSearch
    // /by-phoneNumberStartingWithIgnoreCase?phoneNumber=669&startDate=2015-01-01&endDate=2019-01-01
    return this.$http.get(searchBaseUri + 'by-phoneNumberStartingWithIgnoreCase', {
      params: { phoneNumber, startDate, endDate },
      timeout: this.abortDeferred.promise,
    });
  }

  searchForCustomers(searchOptions) {
    if (!searchOptions.searchText) {
      return this.$q.resolve([]);
    }

    this.abortDeferred.resolve();
    this.abortDeferred = this.$q.defer();

    var promise;
    const { searchText, searchType, resultType, startDate, endDate } = searchOptions.rawData;
    if (searchType === 'phoneNumber') {
      if (resultType === 'ticketsOnly' && startDate && endDate) {
        promise = this._fetchByPhoneNumberIfTickets(searchText, startDate, endDate);
      } else {
        promise = this._fetchByPhoneNumber(searchText);
      }
    } else {
      if (resultType === 'ticketsOnly' && startDate && endDate) {
        promise = this._fetchByLastNameIfTickets(searchText, startDate, endDate);
      } else {
        promise = this._fetchByLastName(searchText);
      }
    }

    return promise.then((response) => {
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
