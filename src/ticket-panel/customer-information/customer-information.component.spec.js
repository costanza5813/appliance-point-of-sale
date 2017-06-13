'use strict';

describe('Component: customerInformation', function () {
  beforeEach(module('appliancePointOfSale'));

  beforeEach(inject(function ($componentController, Customer) {
    this.$componentController = $componentController;

    this.customer = new Customer();

    this.locals = {};
    this.bindings = { customer: this.customer };
    this.createController = () => $componentController('customerInformation', this.locals, this.bindings);
  }));

  it('should correctly bind the customer to the controller', function () {
    const ctrl = this.createController();
    expect(ctrl.customer).toBe(this.customer);
  });
});
