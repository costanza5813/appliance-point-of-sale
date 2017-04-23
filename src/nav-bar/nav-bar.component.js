'use strict';
'ngInject';

angular.module('appliancePointOfSale').component('navBar', {
  bindings: {
  },
  controller: function($http, $q, $state, $window, currentSelections, customerResource, partResource, paymentResource,
                       serviceResource, snapRemote, spinnerHandler, ticketResource) {

    this.toggleSnap = () => {
      snapRemote.toggle('left');
    };

    const doSaveCustomer = () => {
      const customer = currentSelections.customer;
      const ticket = currentSelections.ticket;

      const promises = [
        customerResource.updateCustomer(customer),
        ticketResource.updateTicket(ticket),
      ];


      _.each(ticket.parts, (part) => {
        promises.push(partResource.updatePart(part));
      });

      _.each(ticket.payments, (payment) => {
        promises.push(paymentResource.updatePayment(payment));
      });

      _.each(ticket.services, (service) => {
        promises.push(serviceResource.updateService(service));
      });

      return $q.all(promises);
    };

    this.saveCustomer = () => {
      spinnerHandler.show = true;

      doSaveCustomer().finally(() => {
        spinnerHandler.show = false;
      });
    };

    this.getStateName = () => $state.current.name;

    this.printTicket = () => {
      spinnerHandler.show = true;

      const promises = [
        // doSaveCustomer(),
      ];

      const ticket = currentSelections.ticket.rawData;
      ticket.id = currentSelections.ticket.id || '';
      ticket.parts = _.map(currentSelections.ticket.parts, (part) => part.rawData);
      ticket.payments = _.map(currentSelections.ticket.payments, (payment) => payment.rawData);
      ticket.serviceCalls = _.map(currentSelections.ticket.services, (service) => service.rawData);

      const payload = {
        customer: currentSelections.customer.rawData,
        ticket: ticket,
      };

      const invoicePromise = $http.post('/invoice', payload).then((response) => {
        $window.open('/invoice/' + _.get(response.data, 'invoiceId', ''), '_blank');
      });

      promises.push(invoicePromise);

      $q.all(promises).finally(() => {
        spinnerHandler.show = false;
      });
    };
  },
  templateUrl: 'nav-bar/nav-bar.tpl.html'
});
