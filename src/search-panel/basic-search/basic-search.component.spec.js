'use strict';

describe('Component: basicSearch', function () {
  beforeEach(module('appliancePointOfSale'));

  beforeEach(inject(function ($componentController, SearchOptions) {
    this.$componentController = $componentController;

    this.searchOptions = new SearchOptions();
    this.focusSpy = jasmine.createSpy();

    this.locals = {
      $element: {
        find: () => ({ focus: this.focusSpy }),
      },
    };
    this.bindings = {
      searchOptions: this.searchOptions,
    };
    this.createController = () => {
      const ctrl = $componentController('basicSearch', this.locals, this.bindings);
      ctrl.$onInit();
      return ctrl;
    };
  }));

  describe('$onInit', function () {
    it('should set focus to the input box', function () {
      this.createController();
      expect(this.focusSpy).toHaveBeenCalled();
    });
  });

  describe('setSearchType', function () {
    it('should default to "lastName"', function () {
      const ctrl = this.createController();
      ctrl.setSearchType('unknownType');
      expect(this.searchOptions.searchType).toBe('lastName');
    });

    it('should set to the search type correctly', function () {
      const ctrl = this.createController();

      ctrl.setSearchType('phoneNumber');
      expect(this.searchOptions.searchType).toBe('phoneNumber');

      ctrl.setSearchType('lastName');
      expect(this.searchOptions.searchType).toBe('lastName');
    });

    it('should set focus to the input box', function () {
      const ctrl = this.createController();
      this.focusSpy.calls.reset();

      ctrl.setSearchType('phoneNumber');
      expect(this.focusSpy).toHaveBeenCalled();
    });
  });
});
