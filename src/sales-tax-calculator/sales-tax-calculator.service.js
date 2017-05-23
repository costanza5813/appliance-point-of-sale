'use strict';
'ngInject';

const changedTo635 = moment('07/01/2011', 'L');

class SalesTaxCalculator {
  constructor() {
  }

  getTaxRate(date) {
    if (moment(date).isBefore(changedTo635)) {
      return 0.06;
    }

    return 0.0635;
  }

  calculateTax(total, date) {
    return total * this.getTaxRate(date);
  }
}

angular.module('appliancePointOfSale').service('salesTaxCalculator', SalesTaxCalculator);
