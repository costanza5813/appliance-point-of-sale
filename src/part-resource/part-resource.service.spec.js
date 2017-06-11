'use strict';

describe('Service: partResource', function () {
  beforeEach(module('appliancePointOfSale'));

  beforeEach(inject(function ($httpBackend, $q, partResource) {
    this.$httpBackend = $httpBackend;
    this.$q = $q;
    this.partResource = partResource;
  }));

  describe('fetchPart', function () {
    beforeEach(function () {
      this.uri = '/ShoreTVCustomers/ServiceTickets/quotes/123';
    });

    it('should return the part for the given id', function (done) {
      this.$httpBackend.expectGET(this.uri).respond({ brand: 'GE', description: 'Range' });

      this.partResource.fetchPart('123').then((part) => {
        expect(part).toEqual(jasmine.any(this.partResource.Part));
        expect(part.brand).toBe('GE');
        done();
      });

      this.$httpBackend.flush();
    });

    it('should return a promise that rejects on an error', function (done) {
      this.$httpBackend.expectGET(this.uri).respond(404);

      this.partResource.fetchPart('123').catch((error) => {
        expect(error.status).toBe(404);
        done();
      });

      this.$httpBackend.flush();
    });
  });

  describe('fetchPartsForTicket', function () {
    beforeEach(function () {
      this.uri = '/ShoreTVCustomers/ServiceTickets/quotes/456';
    });

    it('should return the parts for the given ticket', function (done) {
      const response = {};
      _.set(response, '_embedded.quotes', [{ brand: 'Amana', description: 'Refrigerator' }]);

      this.$httpBackend.expectGET(this.uri).respond(response);

      const ticket = { partsHref: this.uri, updateTotals: () => 'updateTotals' };
      this.partResource.fetchPartsForTicket(ticket).then((parts) => {
        expect(parts).toEqual(jasmine.any(Array));
        expect(parts.length).toBe(1);
        expect(parts[0]).toEqual(jasmine.any(this.partResource.Part));
        expect(parts[0].brand).toBe('Amana');
        done();
      });

      this.$httpBackend.flush();
    });

    it('should return a promise that rejects on an error', function (done) {
      this.$httpBackend.expectGET(this.uri).respond(404);

      const ticket = { partsHref: this.uri };
      this.partResource.fetchPartsForTicket(ticket).catch((error) => {
        expect(error.status).toBe(404);
        done();
      });

      this.$httpBackend.flush();
    });
  });

  describe('createPartForTicket', function () {
    beforeEach(function () {
      this.uri = '/ShoreTVCustomers/ServiceTickets/quotes/';
      this.ticket = { selfHref: '/ShoreTVCustomers/ServiceTickets/tickets/111', updateTotals: () => 'updateTotals' };
    });

    it('should return the newly created part', function (done) {
      this.$httpBackend.expectPOST(this.uri,
                                   _.assign(this.partResource.Part.defaults, { ticket: this.ticket.selfHref }))
        .respond({ brand: 'Whirlpool', description: 'Washer' });

      this.partResource.createPartForTicket(this.ticket).then((part) => {
        expect(part).toEqual(jasmine.any(this.partResource.Part));
        expect(part.brand).toBe('Whirlpool');
        expect(part._updateTicket).toEqual(jasmine.any(Function));
        done();
      });

      this.$httpBackend.flush();
    });

    it('should return a promise that rejects on an error', function (done) {
      this.$httpBackend.expectPOST(this.uri,
                                   _.assign(this.partResource.Part.defaults, { ticket: this.ticket.selfHref }))
        .respond(404);

      this.partResource.createPartForTicket(this.ticket).catch((error) => {
        expect(error.status).toBe(404);
        done();
      });

      this.$httpBackend.flush();
    });
  });

  describe('updatePart', function () {
    beforeEach(function () {
      this.uri = '/ShoreTVCustomers/ServiceTickets/quotes/789';
      this.part = new this.partResource.Part();
      this.part.brand = 'Maytag';
      this.part.description = 'Dryer';
      _.set(this.part.rawData, '_links.self.href', this.uri);
    });

    it('should return a promise that resolves if update successful', function (done) {
      this.$httpBackend.expectPUT(this.uri, this.part.rawData).respond({});

      this.partResource.updatePart(this.part).then((response) => {
        expect(response.status).toBe(200);
        done();
      });

      this.$httpBackend.flush();
    });

    it('should return a promise that rejects on an error', function (done) {
      this.$httpBackend.expectPUT(this.uri, this.part.rawData).respond(404);

      this.partResource.updatePart(this.part).catch((error) => {
        expect(error.status).toBe(404);
        done();
      });

      this.$httpBackend.flush();
    });
  });

  describe('deletePart', function () {
    beforeEach(function () {
      this.uri = '/ShoreTVCustomers/ServiceTickets/quotes/222';
      this.part = new this.partResource.Part();
      this.part.brand = 'Frigidaire';
      this.part.description = 'Microwave';
      _.set(this.part.rawData, '_links.self.href', this.uri);
    });

    it('should return a promise that resolves if delete successful', function (done) {
      this.$httpBackend.expectDELETE(this.uri).respond({});

      this.partResource.deletePart(this.part).then((response) => {
        expect(response.status).toBe(200);
        done();
      });

      this.$httpBackend.flush();
    });

    it('should return a promise that rejects on an error', function (done) {
      this.$httpBackend.expectDELETE(this.uri).respond(404);

      this.partResource.deletePart(this.part).catch((error) => {
        expect(error.status).toBe(404);
        done();
      });

      this.$httpBackend.flush();
    });
  });
});
