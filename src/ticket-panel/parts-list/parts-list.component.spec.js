'use strict';

describe('Component: partsList', function () {
  beforeEach(module('appliancePointOfSale'));

  beforeEach(inject(function ($componentController, $q, $rootScope, Ticket) {
    this.$componentController = $componentController;
    this.$q = $q;
    this.$scope = $rootScope.$new();

    this.ticket = new Ticket();

    this.locals = {
      typeaheadOptions: {
        brands: $q.resolve(['Amana', 'Frigidaire', 'GE', 'Whirlpool']),
        descriptions: $q.resolve(['Dryer', 'Microwave', 'Range', 'Refrigerator', 'Washer']),
      },
    };
    this.bindings = { ticket: this.ticket };
    this.createController = () => $componentController('partsList', this.locals, this.bindings);
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

  describe('createNewPart', function () {
    beforeEach(inject(function (partResource) {
      this.partResource = partResource;
      spyOn(partResource, 'createPartForTicket')
        .and.returnValue(this.$q.resolve(new partResource.Part({ brand: 'GE' })));
    }));

    it('should call createPartForTicket providing the current ticket', function () {
      const ctrl = this.createController();
      ctrl.createNewPart();
      expect(this.partResource.createPartForTicket).toHaveBeenCalledWith(this.ticket);
    });

    it('should add the new part to the ticket parts list', function () {
      const ctrl = this.createController();
      ctrl.createNewPart();
      this.$scope.$digest();
      expect(this.ticket.parts.length).toBe(1);
      expect(this.ticket.parts[0].brand).toBe('GE');
    });
  });

  describe('deletePart', function () {
    beforeEach(inject(function ($uibModal, Part) {
      this.$uibModal = $uibModal;
      spyOn($uibModal, 'open');

      this.part = new Part();
    }));

    it('should open a modal dialog with the correct options', function () {
      this.$uibModal.open.and.returnValue({ result: this.$q.resolve() });

      const ctrl = this.createController();
      ctrl.deletePart(this.part);

      expect(this.$uibModal.open).toHaveBeenCalled();
      expect(this.$uibModal.open.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({
        backdrop: 'static',
        keyboard: false,
        component: 'confirmDelete',
      }));
      expect(this.$uibModal.open.calls.mostRecent().args[0].resolve.type()).toBe('part');
    });

    it('should mark the part as deleted only if the modal resolves', function () {
      const ctrl = this.createController();

      this.$uibModal.open.and.returnValue({ result: this.$q.reject() });
      ctrl.deletePart(this.part);

      this.$scope.$digest();

      expect(this.part.deleted).toBeFalsy();

      this.$uibModal.open.and.returnValue({ result: this.$q.resolve() });
      ctrl.deletePart(this.part);

      this.$scope.$digest();

      expect(this.part.deleted).toBeTruthy();
    });
  });
});
