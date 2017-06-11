'use strict';

describe('Component: error', function () {
  beforeEach(module('appliancePointOfSale'));

  beforeEach(inject(function ($componentController, snapRemote) {
    this.$componentController = $componentController;
    this.snapRemote = snapRemote;

    this.locals = {};
    this.bindings = {};
    this.createController = () => {
      const ctrl = $componentController('error', this.locals, this.bindings);
      return ctrl;
    };
  }));

  it('should open the snap to the left', function () {
    spyOn(this.snapRemote, 'open');
    this.createController();
    expect(this.snapRemote.open).toHaveBeenCalledWith('left');
  });
});
