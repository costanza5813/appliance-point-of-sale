'use strict';

describe('Service: customerResource', function () {
  beforeEach(module('appliancePointOfSale'));

  beforeEach(inject(function ($httpBackend, $q, $rootScope, customerResource) {
    this.$httpBackend = $httpBackend;
    this.$q = $q;
    this.$scope = $rootScope.$new();
    this.customerResource = customerResource;
  }));

  describe('_fetchByLastName', function () {
    beforeEach(function () {
      this.uri = '/ShoreTVCustomers/ServiceTickets/customers/' +
        'search/by-lastNameStartingWithIgnoreCase?lastName=Skywalker';
    });

    it('should return a promise resolving to an array of raw customer matches', function (done) {
      const rawResponse = _.set({}, '_embedded.customers', [
        { firstName: 'Luke', lastName: 'Skywalker' },
      ]);

      this.$httpBackend.expectGET(this.uri).respond(rawResponse);

      this.customerResource._fetchByLastName('Skywalker').then((rawCustomers) => {
        expect(rawCustomers.data).toEqual(rawResponse);
        done();
      });

      this.$httpBackend.flush();
    });

    it('should return a promise that rejects on an error', function (done) {
      this.$httpBackend.expectGET(this.uri).respond(404);

      this.customerResource._fetchByLastName('Skywalker').catch((error) => {
        expect(error.status).toBe(404);
        done();
      });

      this.$httpBackend.flush();
    });
  });

  describe('_fetchByLastNameIfTickets', function () {
    beforeEach(function () {
      this.uri = '/ShoreTVCustomers/ServiceTickets/customerSearch/' +
        'by-lastNameStartingWithIgnoreCase?lastName=Skywalker&startDate=2016-01-01&endDate=2017-01-01';
    });

    it('should return a promise resolving to an array of raw customer matches', function (done) {
      const rawResponse = _.set({}, '_embedded.customers', [
        { firstName: 'Luke', lastName: 'Skywalker' },
      ]);

      this.$httpBackend.expectGET(this.uri).respond(rawResponse);

      this.customerResource._fetchByLastNameIfTickets('Skywalker', '2016-01-01', '2017-01-01').then((rawCustomers) => {
        expect(rawCustomers.data).toEqual(rawResponse);
        done();
      });

      this.$httpBackend.flush();
    });

    it('should return a promise that rejects on an error', function (done) {
      this.$httpBackend.expectGET(this.uri).respond(404);

      this.customerResource._fetchByLastNameIfTickets('Skywalker', '2016-01-01', '2017-01-01').catch((error) => {
        expect(error.status).toBe(404);
        done();
      });

      this.$httpBackend.flush();
    });
  });

  describe('_fetchByPhoneNumber', function () {
    beforeEach(function () {
      this.uri = '/ShoreTVCustomers/ServiceTickets/customers/' +
        'search/by-phoneNumberStartingWithIgnoreCase?phoneNumber=6698007';
    });

    it('should return a promise resolving to an array of raw customer matches', function (done) {
      const rawResponse = _.set({}, '_embedded.customers', [
        { firstName: 'Luke', lastName: 'Skywalker', phoneNumber: '6698007' },
      ]);

      this.$httpBackend.expectGET(this.uri).respond(rawResponse);

      this.customerResource._fetchByPhoneNumber('6698007').then((rawCustomers) => {
        expect(rawCustomers.data).toEqual(rawResponse);
        done();
      });

      this.$httpBackend.flush();
    });

    it('should return a promise that rejects on an error', function (done) {
      this.$httpBackend.expectGET(this.uri).respond(404);

      this.customerResource._fetchByPhoneNumber('6698007').catch((error) => {
        expect(error.status).toBe(404);
        done();
      });

      this.$httpBackend.flush();
    });
  });

  describe('_fetchByPhoneNumberIfTickets', function () {
    beforeEach(function () {
      this.uri = '/ShoreTVCustomers/ServiceTickets/customerSearch/' +
        'by-phoneNumberStartingWithIgnoreCase?phoneNumber=6698007&startDate=2016-01-01&endDate=2017-01-01';
    });

    it('should return a promise resolving to an array of raw customer matches', function (done) {
      const rawResponse = _.set({}, '_embedded.customers', [
        { firstName: 'Luke', lastName: 'Skywalker', phoneNumber: '6698007' },
      ]);

      this.$httpBackend.expectGET(this.uri).respond(rawResponse);

      this.customerResource._fetchByPhoneNumberIfTickets('6698007', '2016-01-01', '2017-01-01').then((rawCustomers) => {
        expect(rawCustomers.data).toEqual(rawResponse);
        done();
      });

      this.$httpBackend.flush();
    });

    it('should return a promise that rejects on an error', function (done) {
      this.$httpBackend.expectGET(this.uri).respond(404);

      this.customerResource._fetchByPhoneNumberIfTickets('6698007', '2016-01-01', '2017-01-01').catch((error) => {
        expect(error.status).toBe(404);
        done();
      });

      this.$httpBackend.flush();
    });
  });

  describe('searchForCustomers', function () {
    beforeEach(inject(function (SearchOptions) {
      this.uri = '/ShoreTVCustomers/ServiceTickets/customers/' +
        'search/by-phoneNumberStartingWithIgnoreCase?phoneNumber=6698007';

      this.searchOptions = new SearchOptions();
    }));

    it('should return a promise resolving to an empty array if searchText not provided', function (done) {
      this.customerResource.searchForCustomers(this.searchOptions).then((customers) => {
        expect(customers).toEqual(jasmine.any(Array));
        expect(customers.length).toBe(0);
        done();
      });

      this.$scope.$digest();
    });

    it('should call the correct fetch function based on the search options', function () {
      spyOn(this.customerResource, '_fetchByLastName').and.returnValue(this.$q.resolve({}));
      spyOn(this.customerResource, '_fetchByLastNameIfTickets').and.returnValue(this.$q.resolve({}));
      spyOn(this.customerResource, '_fetchByPhoneNumber').and.returnValue(this.$q.resolve({}));
      spyOn(this.customerResource, '_fetchByPhoneNumberIfTickets').and.returnValue(this.$q.resolve({}));

      this.searchOptions.searchText = 'Skywalker';

      this.customerResource.searchForCustomers(this.searchOptions);
      expect(this.customerResource._fetchByLastName).toHaveBeenCalledWith('Skywalker');

      this.searchOptions.searchType = 'phoneNumber';
      this.searchOptions.searchText = '6698007';

      this.customerResource.searchForCustomers(this.searchOptions);
      expect(this.customerResource._fetchByPhoneNumber).toHaveBeenCalledWith('6698007');

      this.searchOptions.searchType = 'lastName';
      this.searchOptions.searchText = 'Skywalker';
      this.searchOptions.resultType = 'ticketsOnly';
      this.searchOptions.startDate = '2016-01-01';
      this.searchOptions.endDate = '2017-01-01';

      this.customerResource.searchForCustomers(this.searchOptions);
      expect(this.customerResource._fetchByLastNameIfTickets)
        .toHaveBeenCalledWith('Skywalker', '2016-01-01', '2017-01-01');

      this.searchOptions.searchType = 'phoneNumber';
      this.searchOptions.searchText = '6698007';
      this.searchOptions.resultType = 'ticketsOnly';

      this.customerResource.searchForCustomers(this.searchOptions);
      expect(this.customerResource._fetchByPhoneNumberIfTickets)
        .toHaveBeenCalledWith('6698007', '2016-01-01', '2017-01-01');
    });

    it('should return a promise resolving to an array of matching customers', function (done) {
      const rawCustomers = _.set({}, '_embedded.customers', [
        { firstName: 'Luke', lastName: 'Skywalker', phoneNumber: '6698007' },
      ]);

      spyOn(this.customerResource, '_fetchByLastName').and.returnValue(this.$q.resolve({ data: rawCustomers }));

      this.searchOptions.searchText = 'Skywalker';

      this.customerResource.searchForCustomers(this.searchOptions).then((customers) => {
        expect(customers).toEqual(jasmine.any(Array));
        expect(customers.length).toBe(1);
        expect(customers[0]).toEqual(jasmine.any(this.customerResource.Customer));
        expect(customers[0].phoneNumber).toBe('6698007');
        done();
      });

      this.$scope.$digest();
    });

    it('should handle malformed data returned from the backend', function (done) {
      spyOn(this.customerResource, '_fetchByLastName').and.returnValue(this.$q.resolve({}));

      this.searchOptions.searchText = 'Skywalker';

      this.customerResource.searchForCustomers(this.searchOptions).then((customers) => {
        expect(customers).toEqual(jasmine.any(Array));
        expect(customers.length).toBe(0);
        done();
      });

      this.$scope.$digest();
    });

    it('should return a promise that rejects on an error', function (done) {
      spyOn(this.customerResource, '_fetchByLastName').and.returnValue(this.$q.reject({ status: 404 }));

      this.searchOptions.searchText = 'Skywalker';

      this.customerResource.searchForCustomers(this.searchOptions).catch((error) => {
        expect(error.status).toBe(404);
        done();
      });

      this.$scope.$digest();
    });
  });

  describe('fetchCustomer', function () {
    beforeEach(function () {
      this.uri = '/ShoreTVCustomers/ServiceTickets/customers/123';
    });

    it('should return the customer for the given id', function (done) {
      this.$httpBackend.expectGET(this.uri).respond({ firstName: 'Han', lastName: 'Solo' });

      this.customerResource.fetchCustomer('123').then((customer) => {
        expect(customer).toEqual(jasmine.any(this.customerResource.Customer));
        expect(customer.lastName).toBe('Solo');
        expect(customer.rawData._links.tickets.href).toBeDefined();
        done();
      });

      this.$httpBackend.flush();
    });

    it('should return a promise that rejects on an error', function (done) {
      this.$httpBackend.expectGET(this.uri).respond(404);

      this.customerResource.fetchCustomer('123').catch((error) => {
        expect(error.status).toBe(404);
        done();
      });

      this.$httpBackend.flush();
    });
  });

  describe('fetchCustomerForTicket', function () {
    beforeEach(function () {
      this.uri = '/ShoreTVCustomers/ServiceTickets/ticketCustomers/456';
    });

    it('should return the customer for the given ticket', function (done) {
      this.$httpBackend.expectGET(this.uri).respond({ firstName: 'Leia', lastName: 'Organo' });

      const ticket = { customerHref: this.uri };
      this.customerResource.fetchCustomerForTicket(ticket).then((customer) => {
        expect(customer).toEqual(jasmine.any(this.customerResource.Customer));
        expect(customer.lastName).toBe('Organo');
        done();
      });

      this.$httpBackend.flush();
    });

    it('should return a promise that rejects on an error', function (done) {
      this.$httpBackend.expectGET(this.uri).respond(404);

      const ticket = { customerHref: this.uri };
      this.customerResource.fetchCustomerForTicket(ticket).catch((error) => {
        expect(error.status).toBe(404);
        done();
      });

      this.$httpBackend.flush();
    });
  });

  describe('createCustomer', function () {
    beforeEach(function () {
      this.uri = '/ShoreTVCustomers/ServiceTickets/customers/';
    });

    it('should return the newly created customer', function (done) {
      this.$httpBackend.expectPOST(this.uri, this.customerResource.Customer.defaults)
        .respond({ firstName: 'Obi-wan', lastName: 'Kenobi' });

      this.customerResource.createCustomer().then((customer) => {
        expect(customer).toEqual(jasmine.any(this.customerResource.Customer));
        expect(customer.lastName).toBe('Kenobi');
        done();
      });

      this.$httpBackend.flush();
    });

    it('should return a promise that rejects on an error', function (done) {
      this.$httpBackend.expectPOST(this.uri, this.customerResource.Customer.defaults).respond(404);

      this.customerResource.createCustomer().catch((error) => {
        expect(error.status).toBe(404);
        done();
      });

      this.$httpBackend.flush();
    });
  });

  describe('updateCustomer', function () {
    beforeEach(function () {
      this.uri = '/ShoreTVCustomers/ServiceTickets/customers/789';
      this.customer = new this.customerResource.Customer();
      this.customer.firstName = 'Chewbacca';
      this.customer.lastName = '';
      _.set(this.customer.rawData, '_links.self.href', this.uri);
    });

    it('should return a promise that resolves if update successful', function (done) {
      this.$httpBackend.expectPUT(this.uri, this.customer.rawData).respond({});

      this.customerResource.updateCustomer(this.customer).then((response) => {
        expect(response.status).toBe(200);
        done();
      });

      this.$httpBackend.flush();
    });

    it('should return a promise that rejects on an error', function (done) {
      this.$httpBackend.expectPUT(this.uri, this.customer.rawData).respond(404);

      this.customerResource.updateCustomer(this.customer).catch((error) => {
        expect(error.status).toBe(404);
        done();
      });

      this.$httpBackend.flush();
    });
  });
});
