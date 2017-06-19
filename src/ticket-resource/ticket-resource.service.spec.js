'use strict';

describe('Service: ticketResource', function () {
  beforeEach(module('appliancePointOfSale'));

  beforeEach(inject(function ($httpBackend, $q, $rootScope, ticketResource) {
    this.$httpBackend = $httpBackend;
    this.$q = $q;
    this.$scope = $rootScope.$new();
    this.ticketResource = ticketResource;
  }));

  describe('fetchTicket', function () {
    beforeEach(function () {
      this.uri = '/ShoreTVCustomers/ServiceTickets/tickets/123';
    });

    it('should return the ticket for the given id', function (done) {
      this.$httpBackend.expectGET(this.uri).respond({ brand: 'GE' });

      this.ticketResource.fetchTicket('123').then((ticket) => {
        expect(ticket).toEqual(jasmine.any(this.ticketResource.Ticket));
        expect(ticket.brand).toBe('GE');
        done();
      });

      this.$httpBackend.flush();
    });

    it('should return a promise that rejects on an error', function (done) {
      this.$httpBackend.expectGET(this.uri).respond(404);

      this.ticketResource.fetchTicket('123').catch((error) => {
        expect(error.status).toBe(404);
        done();
      });

      this.$httpBackend.flush();
    });
  });

  describe('fetchTicketsForCustomer', function () {
    beforeEach(function () {
      this.uri = '/ShoreTVCustomers/ServiceTickets/customerTickets/456';
    });

    it('should return the tickets for the given customer', function (done) {
      const response = {};
      _.set(response, '_embedded.tickets', [{ brand: 'Amana' }]);

      this.$httpBackend.expectGET(this.uri).respond(response);

      const customer = { ticketsHref: this.uri };
      this.ticketResource.fetchTicketsForCustomer(customer).then((tickets) => {
        expect(tickets).toEqual(jasmine.any(Array));
        expect(tickets.length).toBe(1);
        expect(tickets[0]).toEqual(jasmine.any(this.ticketResource.Ticket));
        expect(tickets[0].brand).toBe('Amana');
        done();
      });

      this.$httpBackend.flush();
    });

    it('should return a promise that rejects on an error', function (done) {
      this.$httpBackend.expectGET(this.uri).respond(404);

      const customer = { ticketsHref: this.uri };
      this.ticketResource.fetchTicketsForCustomer(customer).catch((error) => {
        expect(error.status).toBe(404);
        done();
      });

      this.$httpBackend.flush();
    });
  });

  describe('createTicketForCustomer', function () {
    beforeEach(function () {
      this.uri = '/ShoreTVCustomers/ServiceTickets/tickets/';
      this.customer = { selfHref: '/ShoreTVCustomers/ServiceTickets/customers/111' };
    });

    it('should return the newly created ticket', function (done) {
      this.$httpBackend.expectPOST(this.uri,
                                   _.assign(this.ticketResource.Ticket.defaults, { customer: this.customer.selfHref }))
        .respond({ brand: 'Maytag' });

      this.ticketResource.createTicketForCustomer(this.customer).then((ticket) => {
        expect(ticket).toEqual(jasmine.any(this.ticketResource.Ticket));
        expect(ticket.brand).toBe('Maytag');
        done();
      });

      this.$httpBackend.flush();
    });

    it('should return a promise that rejects on an error', function (done) {
      this.$httpBackend.expectPOST(this.uri,
                                   _.assign(this.ticketResource.Ticket.defaults, { customer: this.customer.selfHref }))
        .respond(404);

      this.ticketResource.createTicketForCustomer(this.customer).catch((error) => {
        expect(error.status).toBe(404);
        done();
      });

      this.$httpBackend.flush();
    });
  });

  describe('updateTicket', function () {
    beforeEach(function () {
      this.uri = '/ShoreTVCustomers/ServiceTickets/tickets/789';
      this.ticket = new this.ticketResource.Ticket();
      this.ticket.brand = 'Chewbacca';
      _.set(this.ticket.rawData, '_links.self.href', this.uri);
    });

    it('should return a promise that resolves if update successful', function (done) {
      this.$httpBackend.expectPUT(this.uri, this.ticket.rawData).respond({});

      this.ticketResource.updateTicket(this.ticket).then((response) => {
        expect(response.status).toBe(200);
        done();
      });

      this.$httpBackend.flush();
    });

    it('should return a promise that rejects on an error', function (done) {
      this.$httpBackend.expectPUT(this.uri, this.ticket.rawData).respond(404);

      this.ticketResource.updateTicket(this.ticket).catch((error) => {
        expect(error.status).toBe(404);
        done();
      });

      this.$httpBackend.flush();
    });
  });
});
