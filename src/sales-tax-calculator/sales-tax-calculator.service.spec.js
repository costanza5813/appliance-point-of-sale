'use strict';

describe('Service: currentSelections', function () {
  beforeEach(module('appliancePointOfSale'));

  beforeEach(inject(function (salesTaxCalculator) {
    this.salesTaxCalculator = salesTaxCalculator;
  }));

  describe('getTaxRate', function () {
    it('should return 0.06 if the date is before July 1, 2011', function () {
      const dateString = '06/01/2011 2:11 PM';
      expect(this.salesTaxCalculator.getTaxRate(dateString)).toBe(0.06);
    });

    it('should return 0.0635 if the date is on or after July 1, 2011', function () {
      let dateString = '07/01/2011 2:11 PM';
      expect(this.salesTaxCalculator.getTaxRate(dateString)).toBe(0.0635);

      dateString = '08/01/2011 2:11 PM';
      expect(this.salesTaxCalculator.getTaxRate(dateString)).toBe(0.0635);
    });
  });

  describe('calculateTax', function () {
    it('should return the tax for the total at the given date', function () {
      let dateString = '06/01/2011 2:11 PM';
      expect(this.salesTaxCalculator.calculateTax(2.00, dateString)).toBe(0.12);

      dateString = '08/01/2011 2:11 PM';
      expect(this.salesTaxCalculator.calculateTax(2.00, dateString)).toBe(0.127);
    });
  });
});
