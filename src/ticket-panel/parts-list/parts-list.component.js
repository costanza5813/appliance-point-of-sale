'use strict';
'ngInject';

angular.module('appliancePointOfSale').component('partsList', {
  bindings: {
    ticket: '<',
  },
  controller: function ($uibModal, partResource, typeaheadOptions) {
    typeaheadOptions.brands.then((brands) => {
      this.brands = brands;
    });

    typeaheadOptions.descriptions.then((descriptions) => {
      this.descriptions = descriptions;
    });

    this.createNewPart = () => {
      partResource.createPartForTicket(this.ticket).then((part) => { this.ticket.addPart(part); });
    };

    this.deletePart = (part) => {
      const modalOptions = {
        backdrop: 'static',
        keyboard: false,
        component: 'confirmDelete',
        resolve: {
          type: () => {
            return 'part';
          },
        },
      };

      $uibModal.open(modalOptions).result.then(() => {
        part.deleted = true;
      });
    };
  },

  templateUrl: 'ticket-panel/parts-list/parts-list.tpl.html',
});
