'use strict';
'ngInject';

angular.module('appliancePointOfSale').component('ticketPanel', {
  bindings: {
  },
  controller: function(customerSelection, snapRemote, ticketSelection) {
    this.ticketSelection = ticketSelection;

    this.toggleSnap = () => {
      snapRemote.toggle('left');
    };
  },
  templateUrl: 'ticket-panel/ticket-panel.tpl.html'
});
