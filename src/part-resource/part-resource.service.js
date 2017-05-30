'use strict';
'ngInject';

const baseUri = '/ShoreTVCustomers/ServiceTickets/quotes/';

class PartResource {
  constructor($http, Part) {
    this.$http = $http;
    this.Part = Part;
  }

  fetchPart(id) {
    return this.$http.get(baseUri + id).then((response) => new this.Part(response.data));
  }

  fetchPartsForTicket(ticket) {
    return this.$http.get(ticket.partsHref).then((response) => {
      const rawParts = _.get(response.data, '_embedded.quotes', []);
      return _.map(rawParts, (rawPart) => new this.Part(rawPart, ticket.updateTotals.bind(ticket)));
    });
  }

  createPartForTicket(ticket) {
    return this.$http.post(baseUri, _.assign(this.Part.defaults, { ticket: ticket.selfHref }))
      .then((response) => new this.Part(response.data, ticket.updateTotals.bind(ticket)));
  }

  updatePart(part) {
    return this.$http.put(part.selfHref, part.rawData);
  }

  deletePart(part) {
    return this.$http.delete(part.selfHref);
  }
}

angular.module('appliancePointOfSale').service('partResource', PartResource);
