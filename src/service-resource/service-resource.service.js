'use strict';
'ngInject';

const baseUri = '/ShoreTVCustomers/ServiceTickets/serviceCalls/';

class ServiceResource {
  constructor($http, Service) {
    this.$http = $http;
    this.Service = Service;
  }

  fetchService(id) {
    return this.$http.get(baseUri + id).then((response) => response.data);
  }

  fetchServicesForTicket(ticket) {
    return this.$http.get(ticket.servicesHref).then((response) => response.data._embedded.serviceCalls);
  }

  createServiceForTicket(ticket) {
    return this.$http.post(baseUri, _.assign(this.Service.defaults, { ticket: ticket.selfHref }))
      .then((response) => response.data);
  }

  updateService(part) {
    return this.$http.put(part.selfHref, part.rawData);
  }
}

angular.module('appliancePointOfSale').factory('serviceResource', ServiceResource);