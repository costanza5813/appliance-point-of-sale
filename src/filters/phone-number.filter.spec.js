'use strict';

describe('Filter: phoneNumber', function () {
  beforeEach(module('appliancePointOfSale'));

  beforeEach(inject(function ($filter) {
    this.filter = (value) => {
      return $filter('phoneNumber')(value);
    };
  }));

  it('should return an empty string if no input provided', function () {
    expect(this.filter()).toBe('');
  });

  it('should return the number unformatted if the length less than 4', function () {
    expect(this.filter(1)).toBe('1');
    expect(this.filter(12)).toBe('12');
    expect(this.filter(123)).toBe('123');
  });

  it('should format as an xxx-xxxx number if the length is greater than 3 and less than 8', function () {
    expect(this.filter(1234)).toBe('123-4');
    expect(this.filter(12345)).toBe('123-45');
    expect(this.filter(123456)).toBe('123-456');
    expect(this.filter(1234567)).toBe('123-4567');
  });

  it('should format as a (xxx) xxx-xxxx number if the length is greater than 7', function () {
    expect(this.filter(12345678)).toBe('(123) 456-78');
    expect(this.filter(123456789)).toBe('(123) 456-789');
    expect(this.filter(1234567890)).toBe('(123) 456-7890');
  });

  it('should trim numbers greater than length 10', function () {
    expect(this.filter(12345678901)).toBe('(123) 456-7890');
  });
});
