'use strict';
'ngInject';

const baseUri = '/ShoreTVCustomers/ServiceTickets/quotes/';

class PartResource {
  constructor($http, Part) {
    this.$http = $http;
    this.Part = Part;
  }

  fetchPart(id) {
    return this.$http.get(baseUri + id).then((response) => response.data);
  }

  fetchPartsForTicket(ticket) {
    return this.$http.get(ticket.partsHref).then((response) => response.data._embedded.quotes);
  }

  createPartForTicket(ticket) {
    return this.$http.post(baseUri, _.assign(this.Part.defaults, { ticket: ticket.selfHref }))
      .then((response) => response.data);
  }

  updatePart(part) {
    return this.$http.put(part.selfHref, part.rawData);
  }
}

angular.module('appliancePointOfSale').factory('partResource', PartResource);
