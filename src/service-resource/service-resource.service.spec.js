'use strict';

describe('Service: serviceResource', function () {
  beforeEach(module('appliancePointOfSale'));

  beforeEach(inject(function ($httpBackend, $q, serviceResource) {
    this.$httpBackend = $httpBackend;
    this.$q = $q;
    this.serviceResource = serviceResource;
  }));

  describe('fetchService', function () {
    beforeEach(function () {
      this.uri = '/ShoreTVCustomers/ServiceTickets/serviceCalls/123';
    });

    it('should return the service for the given id', function (done) {
      this.$httpBackend.expectGET(this.uri).respond({ tech: 'Kevin' });

      this.serviceResource.fetchService('123').then((service) => {
        expect(service).toEqual(jasmine.any(this.serviceResource.Service));
        expect(service.tech).toBe('Kevin');
        done();
      });

      this.$httpBackend.flush();
    });

    it('should return a promise that rejects on an error', function (done) {
      this.$httpBackend.expectGET(this.uri).respond(404);

      this.serviceResource.fetchService('123').catch((error) => {
        expect(error.status).toBe(404);
        done();
      });

      this.$httpBackend.flush();
    });
  });

  describe('fetchServicesForTicket', function () {
    beforeEach(function () {
      this.uri = '/ShoreTVCustomers/ServiceTickets/serviceCalls/456';
    });

    it('should return the services for the given ticket', function (done) {
      const response = {};
      _.set(response, '_embedded.serviceCalls', [{ tech: 'Mikey' }]);

      this.$httpBackend.expectGET(this.uri).respond(response);

      const ticket = { servicesHref: this.uri };
      this.serviceResource.fetchServicesForTicket(ticket).then((services) => {
        expect(services).toEqual(jasmine.any(Array));
        expect(services.length).toBe(1);
        expect(services[0]).toEqual(jasmine.any(this.serviceResource.Service));
        expect(services[0].tech).toBe('Mikey');
        done();
      });

      this.$httpBackend.flush();
    });

    it('should return a promise that rejects on an error', function (done) {
      this.$httpBackend.expectGET(this.uri).respond(404);

      const ticket = { servicesHref: this.uri };
      this.serviceResource.fetchServicesForTicket(ticket).catch((error) => {
        expect(error.status).toBe(404);
        done();
      });

      this.$httpBackend.flush();
    });
  });

  describe('createServiceForTicket', function () {
    beforeEach(function () {
      this.uri = '/ShoreTVCustomers/ServiceTickets/serviceCalls/';
      this.ticket = { selfHref: '/ShoreTVCustomers/ServiceTickets/tickets/111' };
    });

    it('should return the newly created service', function (done) {
      this.$httpBackend.expectPOST(this.uri,
                                   _.assign(this.serviceResource.Service.defaults, { ticket: this.ticket.selfHref }))
        .respond({ tech: 'Keith' });

      this.serviceResource.createServiceForTicket(this.ticket).then((service) => {
        expect(service).toEqual(jasmine.any(this.serviceResource.Service));
        expect(service.tech).toBe('Keith');
        done();
      });

      this.$httpBackend.flush();
    });

    it('should return a promise that rejects on an error', function (done) {
      this.$httpBackend.expectPOST(this.uri,
                                   _.assign(this.serviceResource.Service.defaults, { ticket: this.ticket.selfHref }))
        .respond(404);

      this.serviceResource.createServiceForTicket(this.ticket).catch((error) => {
        expect(error.status).toBe(404);
        done();
      });

      this.$httpBackend.flush();
    });
  });

  describe('updateService', function () {
    beforeEach(function () {
      this.uri = '/ShoreTVCustomers/ServiceTickets/serviceCalls/789';
      this.service = new this.serviceResource.Service();
      this.service.tech = 'Josh';
      _.set(this.service.rawData, '_links.self.href', this.uri);
    });

    it('should return a promise that resolves if update successful', function (done) {
      this.$httpBackend.expectPUT(this.uri, this.service.rawData).respond({});

      this.serviceResource.updateService(this.service).then((response) => {
        expect(response.status).toBe(200);
        done();
      });

      this.$httpBackend.flush();
    });

    it('should return a promise that rejects on an error', function (done) {
      this.$httpBackend.expectPUT(this.uri, this.service.rawData).respond(404);

      this.serviceResource.updateService(this.service).catch((error) => {
        expect(error.status).toBe(404);
        done();
      });

      this.$httpBackend.flush();
    });
  });

  describe('deleteService', function () {
    beforeEach(function () {
      this.uri = '/ShoreTVCustomers/ServiceTickets/serviceCalls/222';
      this.service = new this.serviceResource.Service();
      this.service.tech = 'Drew';
      _.set(this.service.rawData, '_links.self.href', this.uri);
    });

    it('should return a promise that resolves if delete successful', function (done) {
      this.$httpBackend.expectDELETE(this.uri).respond({});

      this.serviceResource.deleteService(this.service).then((response) => {
        expect(response.status).toBe(200);
        done();
      });

      this.$httpBackend.flush();
    });

    it('should return a promise that rejects on an error', function (done) {
      this.$httpBackend.expectDELETE(this.uri).respond(404);

      this.serviceResource.deleteService(this.service).catch((error) => {
        expect(error.status).toBe(404);
        done();
      });

      this.$httpBackend.flush();
    });
  });
});
