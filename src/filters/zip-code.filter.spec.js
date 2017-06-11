'use strict';

describe('Filter: zipCode', function () {
  beforeEach(module('appliancePointOfSale'));

  beforeEach(inject(function ($filter) {
    this.filter = (value) => {
      return $filter('zipCode')(value);
    };
  }));

  it('should return an empty string if no input provided', function () {
    expect(this.filter()).toBe('');
  });

  it('should handle an input with invalid characters', function () {
    expect(this.filter('12@3$4n5')).toBe('12345');
  });

  it('should trim a number with a length greater than 5', function () {
    expect(this.filter('123456')).toBe('12345');
  });
});
