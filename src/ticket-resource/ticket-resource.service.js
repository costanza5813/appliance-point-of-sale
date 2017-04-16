'use strict';
'ngInject';

const baseUri = '/ShoreTVCustomers/ServiceTickets/tickets/';

class TicketResource {
  constructor($http, $q, Ticket) {
    this.$http = $http;
    this.Ticket = Ticket;

    //kdj TODO
    // this.$q = $q;
  }

  fetchTicket(id) {
    return this.$http.get(baseUri + id).then((response) => response.data);
  }

  fetchTicketsForCustomer(customer) {
    return this.$http.get(customer.ticketsHref).then((response) => response.data._embedded.tickets);

    // kdj TODO
    // return this.$q.resolve([
    //   {
    //     idCustomers: null,
    //     item: 'Refrigerator',
    //     brand: 'GE',
    //     model: 'ABC123',
    //     serialNumber: '1234567890',
    //     dateOpen: '03/19/2017',
    //     dateStarted: null,
    //     dateClosed: '04/12/2017',
    //     customerComplaint: '',
    //     serviceDescription: 'test service description',
    //     tax: 0,
    //     total: 100,
    //     subtotal: 0,
    //     amountPaid: 0,
    //     balanceDue: 0,
    //     tech: 'Fred',
    //     statusCode: 1,
    //     store: 'Groton',
    //     _links: {
    //       self: {
    //         href: 'http://localhost:8888/ShoreTVCustomers/ServiceTickets/tickets/1'
    //       },
    //       ticket: {
    //         href: 'http://localhost:8888/ShoreTVCustomers/ServiceTickets/tickets/1'
    //       },
    //       customer: {
    //         href: 'http://localhost:8888/ShoreTVCustomers/ServiceTickets/tickets/1/customer'
    //       },
    //       serviceCalls: {
    //         href: 'http://localhost:8888/ShoreTVCustomers/ServiceTickets/tickets/1/serviceCalls'
    //       },
    //       payments: {
    //         href: 'http://localhost:8888/ShoreTVCustomers/ServiceTickets/tickets/1/payments'
    //       },
    //       quotes: {
    //         href: 'http://localhost:8888/ShoreTVCustomers/ServiceTickets/tickets/1/quotes'
    //       }
    //     }
    //   },
    //   {
    //     idCustomers: 1,
    //     item: 'Refrigerator',
    //     brand: 'GE',
    //     model: 'ABC123',
    //     serialNumber: '1234567890',
    //     dateOpen: '03/19/2017',
    //     dateStarted: null,
    //     dateClosed: '04/12/2017',
    //     customerComplaint: '',
    //     serviceDescription: 'test service description',
    //     tax: 0,
    //     total: 200,
    //     subtotal: 0,
    //     amountPaid: 0,
    //     balanceDue: 0,
    //     tech: 'Fred',
    //     statusCode: 1,
    //     store: 'Groton',
    //     _links: {
    //       self: {
    //         href: 'http://localhost:8888/ShoreTVCustomers/ServiceTickets/tickets/2'
    //       },
    //       ticket: {
    //         href: 'http://localhost:8888/ShoreTVCustomers/ServiceTickets/tickets/2'
    //       },
    //       customer: {
    //         href: 'http://localhost:8888/ShoreTVCustomers/ServiceTickets/tickets/2/customer'
    //       },
    //       serviceCalls: {
    //         href: 'http://localhost:8888/ShoreTVCustomers/ServiceTickets/tickets/2/serviceCalls'
    //       },
    //       payments: {
    //         href: 'http://localhost:8888/ShoreTVCustomers/ServiceTickets/tickets/2/payments'
    //       },
    //       quotes: {
    //         href: 'http://localhost:8888/ShoreTVCustomers/ServiceTickets/tickets/2/quotes'
    //       }
    //     }
    //   },
    //   ]);
  }

  createTicketForCustomer(customer) {
    return this.$http.post(baseUri, _.assign(this.Ticket.defaults, { customer: customer.selfHref }))
      .then((response) => response.data);
  }

  updateTicket(ticket) {
    return this.$http.put(ticket.selfHref, ticket.rawData);
  }
}

angular.module('appliancePointOfSale').factory('ticketResource', TicketResource);
