'use strict';

describe('Component: advancedSearch', function () {
  beforeEach(module('appliancePointOfSale'));

  beforeEach(inject(function ($componentController, SearchOptions) {
    this.$componentController = $componentController;

    const modal = {
      dismiss: jasmine.createSpy(),
    };

    this.searchOptions = new SearchOptions();

    this.locals = {};
    this.bindings = {
      modalInstance: modal,
      resolve: { searchOptions: this.searchOptions },
    };
    this.createController = () => {
      const ctrl = $componentController('advancedSearch', this.locals, this.bindings);
      ctrl.$onInit();
      return ctrl;
    };
  }));

  describe('$onInit', function () {
    it('should set the searchOptions from the resolve binding', function () {
      const ctrl = this.createController();
      expect(ctrl.searchOptions).toBe(this.searchOptions);
    });
  });

  describe('close', function () {
    it('should call modalInstance#dismiss', function () {
      const ctrl = this.createController();
      ctrl.close();
      expect(ctrl.modalInstance.dismiss).toHaveBeenCalled();
    });
  });
});
