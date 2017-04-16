'use strict';
'ngInject';

angular.module('appliancePointOfSale').component('partsList', {
  bindings: {
      ticket: '<'
  },
  controller: function(Part, partResource) {

      this.createNewPart = () => {
        partResource.createPartForTicket(this.ticket).then((rawPart) => {
          this.ticket.addPart(new Part(rawPart, this.ticket.updateTotals.bind(this.ticket)));
        });
      };
  },
  templateUrl: 'ticket-panel/parts-list/parts-list.tpl.html'
});