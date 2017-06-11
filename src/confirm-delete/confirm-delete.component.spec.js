'use strict';

describe('Component: confirmDelte', function () {
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
      resolve: { type: 'some type' },
    };
    this.createController = () => {
      const ctrl = $componentController('confirmDelete', this.locals, this.bindings);
      ctrl.$onInit();
      return ctrl;
    };
  }));

  describe('$onInit', function () {
    it('should set the type from the resolve binding', function () {
      const ctrl = this.createController();
      expect(ctrl.type).toBe('some type');
    });
  });

  describe('onCancel', function () {
    it('should call modalInstance#dismiss', function () {
      const ctrl = this.createController();
      ctrl.onCancel();
      expect(ctrl.modalInstance.dismiss).toHaveBeenCalled();
    });
  });

  describe('onDelete', function () {
    it('should call modalInstance#close', function () {
      const ctrl = this.createController();
      ctrl.onDelete();
      expect(ctrl.modalInstance.close).toHaveBeenCalled();
    });
  });

  describe('properCaseType', function () {
    it('should correctly convert single words to proper case', function () {
      this.bindings.resolve.type = 'word';
      const ctrl = this.createController();
      expect(ctrl.properCaseType()).toBe('Word');
    });

    it('should correctly convert multiple words to proper case', function () {
      this.bindings.resolve.type = 'multiple words';
      const ctrl = this.createController();
      expect(ctrl.properCaseType()).toBe('Multiple Words');
    });
  });
});
