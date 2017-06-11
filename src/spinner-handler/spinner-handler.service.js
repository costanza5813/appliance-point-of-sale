'use strict';
'ngInject';

class SpinnerHandler {
  constructor() {
    this.show = false;
    this.config = { radius: 80, width: 16, length: 32, color: 'white' };
  }
}

angular.module('appliancePointOfSale').service('spinnerHandler', SpinnerHandler);
