'use strict';
'ngInject';

angular.module('appliancePointOfSale').component('navBar', {
  bindings: {
  },
  controller: function($http, $q, $state, $window, currentSelections, snapRemote, spinnerHandler) {
    this.hideCustomerTotals = true;

    this.toggleSnap = () => {
      snapRemote.toggle('left');
    };

    this.saveCustomer = () => {
      spinnerHandler.show = true;

      currentSelections.save().finally(() => {
        spinnerHandler.show = false;
      });
    };

    this.disableControls = () => !_.includes(['customers', 'tickets'], $state.current.name);

    this.printTicket = () => {
      spinnerHandler.show = true;

      const promises = [
        currentSelections.save(),
      ];

      const ticket = _.cloneDeep(currentSelections.ticket.rawData);
      ticket.id = currentSelections.ticket.id || '';
      ticket.parts = _.map(currentSelections.ticket.parts, (part) => part.rawData);
      ticket.payments = _.map(currentSelections.ticket.payments, (payment) => payment.rawData);
      ticket.serviceCalls = _.map(currentSelections.ticket.services, (service) => service.rawData);
      ticket.hideCustomerTotals = this.hideCustomerTotals;

      const payload = {
        customer: currentSelections.customer.rawData,
        ticket: ticket,
      };

      const invoicePromise = $http.post('/ShoreTVCustomers/ServiceTickets/invoice', payload).then((response) => {
        $window.open('/ShoreTVCustomers/ServiceTickets/invoice/' + _.get(response.data, 'invoiceId', ''), '_blank');
      });

      promises.push(invoicePromise);

      $q.all(promises).finally(() => {
        spinnerHandler.show = false;
      });
    };
  },
  templateUrl: 'nav-bar/nav-bar.tpl.html'
});
