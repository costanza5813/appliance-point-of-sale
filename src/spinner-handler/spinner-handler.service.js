'use strict';
'ngInject';

class SpinnerHandler {
  constructor() {
    this.spinner = false;
    this.config = { radius: 40, width: 8, length: 16 };
  }
}

angular.module('appliancePointOfSale').factory('spinnerHandler', SpinnerHandler);
