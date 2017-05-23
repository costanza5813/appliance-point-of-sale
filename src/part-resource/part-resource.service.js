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
    return this.$http.get(ticket.partsHref)
      .then((response) => _.get(response.data, '_embedded.quotes', []));
  }

  createPartForTicket(ticket) {
    return this.$http.post(baseUri, _.assign(this.Part.defaults, { ticket: ticket.selfHref }))
      .then((response) => response.data);
  }

  updatePart(part) {
    return this.$http.put(part.selfHref, part.rawData);
  }

  deletePart(part) {
    return this.$http.delete(part.selfHref);
  }
}

angular.module('appliancePointOfSale').service('partResource', PartResource);
