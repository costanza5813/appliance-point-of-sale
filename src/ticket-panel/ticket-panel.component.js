'use strict';
'ngInject';

angular.module('appliancePointOfSale').component('ticketPanel', {
  bindings: {
    customer: '<',
  },
  controller: function($q, currentSelections, Part, partResource, Payment, paymentResource, Service, serviceResource,
                       spinnerHandler, Ticket, ticketResource) {

    this.spinnerHandler = spinnerHandler;
    this.spinnerHandler.show = true;

    this.$onInit = () => {
      currentSelections.customer = this.customer;

      ticketResource.fetchTicketsForCustomer(this.customer).then((rawTickets) => {
        if(_.isEmpty(rawTickets)) {
          return ticketResource.createTicketForCustomer(this.customer).then((rawTicket) => [rawTicket]);
        }
        return rawTickets;
      }).then((rawTickets) => {
        const promises = [];
        _.each(rawTickets, (rawTicket) => {
          const ticket = new Ticket(rawTicket);
          this.customer.addTicket(ticket);

          const partsPromise = partResource.fetchPartsForTicket(ticket).then((rawParts) => {
            _.each(rawParts, (rawPart) => {
              ticket.addPart(new Part(rawPart, ticket.updateTotals.bind(ticket)));
            });
          });

          const paymentsPromise = paymentResource.fetchPaymentsForTicket(ticket).then((rawPayments) => {
            _.each(rawPayments, (rawPayment) => {
              ticket.addPayment(new Payment(rawPayment, ticket.updateTotals.bind(ticket)));
            });
          });

          const servicesPromise = serviceResource.fetchServicesForTicket(ticket).then((rawServices) => {
            _.each(rawServices, (rawService) => {
              ticket.addService(new Service(rawService));
            });
          });

          promises.push(partsPromise, paymentsPromise, servicesPromise);
        });

        return $q.all(promises);
      }).finally(() => {
        this.spinnerHandler.show = false;
        this.paginationIndex = this.customer.tickets.length;
        this.currentTicket = _.last(this.customer.tickets);
        currentSelections.ticket = this.currentTicket;
      });
    };

    this.changeTicket = () => {
      this.currentTicket = this.customer.tickets[this.paginationIndex - 1];
      currentSelections.ticket = this.currentTicket;
    };

    this.createNewTicket = () => {
      ticketResource.createTicketForCustomer(this.customer).then((rawTicket) => {
        this.customer.addTicket(new Ticket(rawTicket));
        this.paginationIndex = this.customer.tickets.length;
        this.currentTicket = _.last(this.customer.tickets);
        currentSelections.ticket = this.currentTicket;
      });
    };
  },
  templateUrl: 'ticket-panel/ticket-panel.tpl.html'
});
