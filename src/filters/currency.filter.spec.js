'use strict';

describe('Filter: currency', function () {
  beforeEach(module('appliancePointOfSale'));

  beforeEach(inject(function ($filter) {
    this.filter = (value) => {
      return $filter('currency')(value);
    };
  }));

  it('should return $0.00 if no input provided', function () {
    expect(this.filter()).toBe('$0.00');
  });

  it('should handle a number with no whole part', function () {
    expect(this.filter(0.01)).toBe('$0.01');
    expect(this.filter(0.12)).toBe('$0.12');
  });

  it('should handle a number with a whole part', function () {
    expect(this.filter(1.23)).toBe('$1.23');
    expect(this.filter(1234.56)).toBe('$1234.56');
  });

  it('should handle negative numbers', function () {
    expect(this.filter(-0.01)).toBe('-$0.01');
    expect(this.filter(-1.23)).toBe('-$1.23');
  });
});
