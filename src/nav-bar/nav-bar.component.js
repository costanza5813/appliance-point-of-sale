'use strict';
'ngInject';

angular.module('appliancePointOfSale').component('navBar', {
  bindings: {
  },
  controller: function ($http, $q, $state, $window, currentSelections, snapRemote, spinnerHandler) {
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

    this.disableControls = () => !_.includes(['customerTickets', 'tickets'], $state.current.name);

    this.printTicket = () => {
      spinnerHandler.show = true;

      currentSelections.save().then(() => {
        spinnerHandler.show = false;
        const service = '/ShoreTVCustomers/ServiceTickets/printable-ticket/';
        const id = currentSelections.ticket.id;
        $window.open(service + id + '?hideCustomerTotals=' + this.hideCustomerTotals, '_blank');
      });
    };
  },

  templateUrl: 'nav-bar/nav-bar.tpl.html',
});
