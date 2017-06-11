'use strict';

describe('Component: confirmUnsavedChanges', function () {
  beforeEach(module('appliancePointOfSale'));

  beforeEach(inject(function ($componentController) {
    this.$componentController = $componentController;

    const modal = {
      dismiss: jasmine.createSpy(),
      close: jasmine.createSpy(),
    };

    this.locals = {};
    this.bindings = {
      modalInstance: modal,
    };

    this.createController = () => {
      const ctrl = $componentController('confirmUnsavedChanges', this.locals, this.bindings);
      return ctrl;
    };
  }));

  describe('onDiscard', function () {
    it('should call modalInstance#dismiss', function () {
      const ctrl = this.createController();
      ctrl.onDiscard();
      expect(ctrl.modalInstance.dismiss).toHaveBeenCalled();
    });
  });

  describe('onSave', function () {
    it('should call modalInstance#close', function () {
      const ctrl = this.createController();
      ctrl.onSave();
      expect(ctrl.modalInstance.close).toHaveBeenCalled();
    });
  });
});
