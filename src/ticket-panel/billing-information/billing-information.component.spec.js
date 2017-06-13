'use strict';

describe('Component: billingInformation', function () {
  beforeEach(module('appliancePointOfSale'));

  beforeEach(inject(function ($componentController, Ticket) {
    this.$componentController = $componentController;

    this.ticket = new Ticket();

    this.locals = {};
    this.bindings = { ticket: this.ticket };
    this.createController = () => $componentController('billingInformation', this.locals, this.bindings);
  }));

  it('should correctly bind the ticket to the controller', function () {
    const ctrl = this.createController();
    expect(ctrl.ticket).toBe(this.ticket);
  });
});
