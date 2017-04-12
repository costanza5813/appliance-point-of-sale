'use strict';
'ngInject';

angular.module('appliancePointOfSale').component('ticketPanel', {
  bindings: {
  },
  controller: function(customerSelection, snapRemote, ticketSelection) {
    this.ticketSelection = ticketSelection;

      this.parts = [];

      for(let i = 0; i < 5; i++ ) {
          this.parts.push({
              brand: 'Brand ' + i,
              description: 'Desc ' + i,
              partNumber: 'PartNum ' + i,
              price: i * 10,
              quantity: i,
          });
      }

    this.toggleSnap = () => {
      snapRemote.toggle('left');
    };
  },
  templateUrl: 'ticket-panel/ticket-panel.tpl.html'
});
