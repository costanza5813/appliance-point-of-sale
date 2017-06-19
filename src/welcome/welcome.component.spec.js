'use strict';

describe('Component: welcome', function () {
  beforeEach(module('appliancePointOfSale'));

  beforeEach(inject(function ($componentController, snapRemote) {
    this.$componentController = $componentController;
    this.snapRemote = snapRemote;

    spyOn(window, 'moment').and.returnValue({ hour: () => 8 });

    this.locals = {};
    this.bindings = {};
    this.createController = () => {
      return $componentController('welcome', this.locals, this.bindings);
    };
  }));

  it('should open the snap to the left', function () {
    spyOn(this.snapRemote, 'open');
    this.createController();
    expect(this.snapRemote.open).toHaveBeenCalledWith('left');
  });

  it('should set the partOfDay to "morning" if before 12pm', function () {
    const ctrl = this.createController();
    expect(ctrl.partOfDay).toBe('morning');
  });

  it('should set the partOfDay to "afternoon" if before 5pm', function () {
    window.moment.and.returnValue({ hour: () => 13 });
    const ctrl = this.createController();
    expect(ctrl.partOfDay).toBe('afternoon');
  });

  it('should set the partOfDay to "evening" if after 5pm', function () {
    window.moment.and.returnValue({ hour: () => 19 });
    const ctrl = this.createController();
    expect(ctrl.partOfDay).toBe('evening');
  });
});
