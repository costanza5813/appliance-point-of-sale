'use strict';
'ngInject';

class TypeaheadOptions {
  constructor($http, $q) {
    this._promise = $q.all({
      brands: $http.get('data/brands.json'),
      descriptions: $http.get('data/descriptions.json'),
      salespeople: $http.get('data/salespeople.json'),
      techs: $http.get('data/techs.json'),
    }).then((responses) => {
      this._brands = responses.brands.data;
      this._descriptions = responses.descriptions.data;
      this._salespeople = responses.salespeople.data;
      this._techs = responses.techs.data;
    });
  }

  get brands() {
    return this._promise.then(() => {
      return this._brands || [];
    });
  }

  get descriptions() {
    return this._promise.then(() => {
      return this._descriptions || [];
    });
  }

  get salespeople() {
    return this._promise.then(() => {
      return this._salespeople || [];
    });
  }

  get techs() {
    return this._promise.then(() => {
      return this._techs || [];
    });
  }
}

angular.module('appliancePointOfSale').factory('typeaheadOptions', TypeaheadOptions);
