'use strict';
'ngInject';

angular.module('appliancePointOfSale').component('navBar', {
  bindings: {
  },
  controller: function($state, currentSelections, customerResource, partResource, paymentResource, serviceResource,
                       snapRemote, ticketResource) {

    this.toggleSnap = () => {
      snapRemote.toggle('left');
    };

    this.saveCustomer = () => {
      const customer = currentSelections.customer;
      customerResource.updateCustomer(customer);

      _.each(customer.tickets, (ticket) => {
        ticketResource.updateTicket(ticket);

        _.each(ticket.parts, (part) => {
          partResource.updatePart(part);
        });

        _.each(ticket.payments, (payment) => {
          paymentResource.updatePayment(payment);
        });

        _.each(ticket.services, (service) => {
          serviceResource.updateService(service);
        });
      });
    };

    this.printTicket = () => {
      $state.go('print');
    };
  },
  templateUrl: 'nav-bar/nav-bar.tpl.html'
});
