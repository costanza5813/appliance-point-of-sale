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
