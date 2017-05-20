'use strict';
'ngInject';

angular.module('appliancePointOfSale').component('serviceList', {
  bindings: {
    ticket: '<',
  },
  controller: function(Service, serviceResource, typeaheadOptions) {
    typeaheadOptions.techs.then((techs) => {
      this.techs = techs;
    });

    this.createNewService = () => {
      serviceResource.createServiceForTicket(this.ticket).then((rawService) => {
        this.ticket.addService(new Service(rawService));
      });
    };
  },
  templateUrl: 'ticket-panel/service-list/service-list.tpl.html'
});
