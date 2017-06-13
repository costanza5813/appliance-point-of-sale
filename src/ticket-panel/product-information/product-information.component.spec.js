'use strict';

describe('Component: productInformation', function () {
  beforeEach(module('appliancePointOfSale'));

  beforeEach(inject(function ($componentController, $q, $rootScope, Ticket) {
    this.$componentController = $componentController;
    this.$scope = $rootScope.$new();

    this.ticket = new Ticket();

    this.locals = {
      typeaheadOptions: {
        brands: $q.resolve(['Amana', 'Frigidaire', 'GE', 'Whirlpool']),
        descriptions: $q.resolve(['Dryer', 'Microwave', 'Range', 'Refrigerator', 'Washer']),
      },
    };
    this.bindings = { ticket: this.ticket };
    this.createController = () => $componentController('productInformation', this.locals, this.bindings);
  }));

  it('should get the brands list from the typeaheadOptions service', function () {
    const ctrl = this.createController();
    this.$scope.$digest();
    expect(ctrl.brands).toEqual(jasmine.any(Array));
    expect(ctrl.brands.length).toBe(4);
  });

  it('should get the descriptions list from the typeaheadOptions service', function () {
    const ctrl = this.createController();
    this.$scope.$digest();
    expect(ctrl.descriptions).toEqual(jasmine.any(Array));
    expect(ctrl.descriptions.length).toBe(5);
  });
});
