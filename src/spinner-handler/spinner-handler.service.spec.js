'use strict';

describe('Service: spinnerHandler', function () {
  beforeEach(module('appliancePointOfSale'));

  beforeEach(inject(function (spinnerHandler) {
    this.spinnerHandler = spinnerHandler;
  }));

  it('should default show to false', function () {
    expect(this.spinnerHandler.show).toBeFalsy();
  });

  it('should setup config', function () {
    expect(this.spinnerHandler.config).toEqual(jasmine.any(Object));
  });
});
