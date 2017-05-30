'use strict';
'ngInject';

const baseUri = '/ShoreTVCustomers/ServiceTickets/tickets/';

class TicketResource {
  constructor($http, Ticket) {
    this.$http = $http;
    this.Ticket = Ticket;
  }

  fetchTicket(id) {
    return this.$http.get(baseUri + id).then((response) => new this.Ticket(response.data));
  }

  fetchTicketsForCustomer(customer) {
    return this.$http.get(customer.ticketsHref).then((response) => {
      const rawTickets = _.get(response.data, '_embedded.tickets', []);
      return _.map(rawTickets, (rawTicket) => new this.Ticket(rawTicket));
    });
  }

  createTicketForCustomer(customer) {
    return this.$http.post(baseUri, _.assign(this.Ticket.defaults, { customer: customer.selfHref }))
      .then((response) => new this.Ticket(response.data));
  }

  updateTicket(ticket) {
    return this.$http.put(ticket.selfHref, ticket.rawData);
  }
}

angular.module('appliancePointOfSale').service('ticketResource', TicketResource);
