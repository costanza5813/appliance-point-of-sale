'use strict';
'ngInject';

angular.module('appliancePointOfSale').component('serviceList', {
  bindings: {
    ticket: '<',
  },
  controller: function($uibModal, Service, serviceResource, typeaheadOptions) {
    typeaheadOptions.techs.then((techs) => {
      this.techs = techs;
    });

    this.createNewService = () => {
      serviceResource.createServiceForTicket(this.ticket).then((rawService) => {
        this.ticket.addService(new Service(rawService));
      });
    };

    this.deleteService = (service) => {
      const modalOptions = {
        backdrop: 'static',
        keyboard: false,
        component: 'confirmDelete',
        resolve: {
          type: () => {
            return 'service call';
          }
        }
      };

      $uibModal.open(modalOptions).result.then(() => {
        service.deleted = true;
      });
    };
  },
  templateUrl: 'ticket-panel/service-list/service-list.tpl.html'
});
