'use strict';
'ngInject';

class SpinnerHandler {
  constructor() {
    this.spinner = false;
    this.config = { radius: 80, width: 16, length: 32, color: 'white' };
  }
}

angular.module('appliancePointOfSale').factory('spinnerHandler', SpinnerHandler);
