'use strict';

describe('Service: customerResource', function () {
  beforeEach(module('appliancePointOfSale'));

  beforeEach(inject(function ($httpBackend, $q, $rootScope, customerResource) {
    this.$httpBackend = $httpBackend;
    this.$q = $q;
    this.$scope = $rootScope.$new();
    this.customerResource = customerResource;
  }));

  describe('fetchByLastName', function () {
    beforeEach(function () {
      this.uri = '/ShoreTVCustomers/ServiceTickets/customers/' +
        'search/by-lastNameStartingWithIgnoreCase?lastName=Skywalker';
    });

    it('should return a promise resolving to an empty array if last name not provided', function (done) {
      this.customerResource.fetchByLastName().then((customers) => {
        expect(customers).toEqual(jasmine.any(Array));
        expect(customers.length).toBe(0);
        done();
      });

      this.$scope.$digest();
    });

    it('should return a promise resolving to an array of matching customers', function (done) {
      this.$httpBackend.expectGET(this.uri).respond(_.set({}, '_embedded.customers', [
        { firstName: 'Luke', lastName: 'Skywalker' },
      ]));

      this.customerResource.fetchByLastName('Skywalker').then((customers) => {
        expect(customers).toEqual(jasmine.any(Array));
        expect(customers.length).toBe(1);
        expect(customers[0]).toEqual(jasmine.any(this.customerResource.Customer));
        expect(customers[0].lastName).toBe('Skywalker');
        done();
      });

      this.$httpBackend.flush();
    });

    it('should handle malformed data returned from the backend', function (done) {
      this.$httpBackend.expectGET(this.uri).respond({});

      this.customerResource.fetchByLastName('Skywalker').then((customers) => {
        expect(customers).toEqual(jasmine.any(Array));
        expect(customers.length).toBe(0);
        done();
      });

      this.$httpBackend.flush();
    });

    it('should return a promise that rejects on an error', function (done) {
      this.$httpBackend.expectGET(this.uri).respond(404);

      this.customerResource.fetchByLastName('Skywalker').catch((error) => {
        expect(error.status).toBe(404);
        done();
      });

      this.$httpBackend.flush();
    });
  });

  describe('fetchByPhoneNumber', function () {
    beforeEach(function () {
      this.uri = '/ShoreTVCustomers/ServiceTickets/customers/' +
        'search/by-phoneNumberStartingWithIgnoreCase?phoneNumber=6698007';
    });

    it('should return a promise resolving to an empty array if phone number not provided', function (done) {
      this.customerResource.fetchByPhoneNumber().then((customers) => {
        expect(customers).toEqual(jasmine.any(Array));
        expect(customers.length).toBe(0);
        done();
      });

      this.$scope.$digest();
    });

    it('should return a promise resolving to an array of matching customers', function (done) {
      this.$httpBackend.expectGET(this.uri).respond(_.set({}, '_embedded.customers', [
        { phoneNumber: '6698007' },
      ]));

      this.customerResource.fetchByPhoneNumber('6698007').then((customers) => {
        expect(customers).toEqual(jasmine.any(Array));
        expect(customers.length).toBe(1);
        expect(customers[0]).toEqual(jasmine.any(this.customerResource.Customer));
        expect(customers[0].phoneNumber).toBe('6698007');
        done();
      });

      this.$httpBackend.flush();
    });

    it('should handle malformed data returned from the backend', function (done) {
      this.$httpBackend.expectGET(this.uri).respond({});

      this.customerResource.fetchByPhoneNumber('6698007').then((customers) => {
        expect(customers).toEqual(jasmine.any(Array));
        expect(customers.length).toBe(0);
        done();
      });

      this.$httpBackend.flush();
    });

    it('should return a promise that rejects on an error', function (done) {
      this.$httpBackend.expectGET(this.uri).respond(404);

      this.customerResource.fetchByPhoneNumber('6698007').catch((error) => {
        expect(error.status).toBe(404);
        done();
      });

      this.$httpBackend.flush();
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
