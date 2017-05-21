'use strict';
'ngInject';

class Service {
  static get defaults() {
    return {
      description: '',
      serviceDate: null,
      tech: '',
    };
  }

  constructor(rawData) {
    this._rawData = _.assign(Service.defaults, rawData);
    this._deleted = false;
  }

  get rawData() {
    return this._rawData;
  }

  get id() {
    return this.selfHref.slice(this.selfHref.lastIndexOf('/') + 1);
  }

  get selfHref() {
    return _.get(this._rawData, '_links.self.href');
  }

  get description() {
    return this._rawData.description;
  }

  set description(description) {
    this._rawData.description = description;
  }

  get serviceDate() {
    return this._rawData.serviceDate;
  }

  set serviceDate(serviceDate) {
    this._rawData.serviceDate = serviceDate;
  }

  get tech() {
    return this._rawData.tech;
  }

  set tech(tech) {
    this._rawData.tech = tech;
  }

  get deleted() {
    return this._deleted;
  }

  set deleted(deleted) {
    this._deleted = deleted;
  }
}

angular.module('appliancePointOfSale').factory('Service', () => Service);
