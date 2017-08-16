'use strict';
'ngInject';

angular.module('appliancePointOfSale').component('ticketPanel', {
  bindings: {
    customer: '<',
  },
  controller: function ($q, currentSelections, partResource, paymentResource, serviceResource, spinnerHandler,
                        ticketResource, typeaheadOptions) {

    this.spinnerHandler = spinnerHandler;
    this.spinnerHandler.show = true;

    typeaheadOptions.salespeople.then((salespeople) => {
      this.salespeople = salespeople;
    });

    this.$onInit = () => {
      currentSelections.customer = this.customer;
      this.paginationIndex = this.customer.tickets.length;

      const promises = [];
      _.each(this.customer.tickets, (ticket) => {

        const partsPromise = partResource.fetchPartsForTicket(ticket).then((parts) => {
          _.each(parts, (part) => { ticket.addPart(part); });
        });

        const paymentsPromise = paymentResource.fetchPaymentsForTicket(ticket).then((payments) => {
          _.each(payments, (payment) => { ticket.addPayment(payment); });
        });

        const servicesPromise = serviceResource.fetchServicesForTicket(ticket).then((services) => {
          _.each(services, (service) => { ticket.addService(service); });
        });

        promises.push(partsPromise, paymentsPromise, servicesPromise);
      });

      $q.all(promises).finally(() => {
        currentSelections.ticket = this.currentTicket = _.last(this.customer.tickets);
        this.spinnerHandler.show = false;
      });
    };

    this.changeTicket = () => {
      currentSelections.ticket = this.currentTicket = this.customer.tickets[this.paginationIndex - 1];
    };

    this.createNewTicket = () => {
      ticketResource.createTicketForCustomer(this.customer).then((ticket) => {
        this.customer.addTicket(ticket);
        this.paginationIndex = this.customer.tickets.length;
        currentSelections.ticket = this.currentTicket = ticket;
      });
    };
  },

  templateUrl: 'ticket-panel/ticket-panel.tpl.html',
});
