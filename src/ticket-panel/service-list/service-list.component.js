'use strict';
'ngInject';

angular.module('appliancePointOfSale').component('serviceList', {
  bindings: {
    ticket: '<',
  },
  controller: function(Service, serviceResource) {
    this.techs = ['Kevin', 'Mikey', 'Rob', 'Other'];

    this.createNewService = () => {
      serviceResource.createServiceForTicket(this.ticket).then((rawService) => {
        this.ticket.addService(new Service(rawService));
      });
    };
  },
  templateUrl: 'ticket-panel/service-list/service-list.tpl.html'
});
