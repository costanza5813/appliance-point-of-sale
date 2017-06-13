'use strict';

describe('Component: serviceList', function () {
  beforeEach(module('appliancePointOfSale'));

  beforeEach(inject(function ($componentController, $q, $rootScope, Ticket) {
    this.$componentController = $componentController;
    this.$q = $q;
    this.$scope = $rootScope.$new();

    this.ticket = new Ticket();

    this.locals = {
      typeaheadOptions: {
        techs: $q.resolve(['Luke', 'Han', 'Leah']),
      },
    };
    this.bindings = { ticket: this.ticket };
    this.createController = () => $componentController('serviceList', this.locals, this.bindings);
  }));

  it('should get the techs list from the typeaheadOptions service', function () {
    const ctrl = this.createController();
    this.$scope.$digest();
    expect(ctrl.techs).toEqual(jasmine.any(Array));
    expect(ctrl.techs.length).toBe(3);
  });

  describe('createNewService', function () {
    beforeEach(inject(function (serviceResource) {
      this.serviceResource = serviceResource;
      spyOn(serviceResource, 'createServiceForTicket')
        .and.returnValue(this.$q.resolve(new serviceResource.Service({ tech: 'Luke' })));
    }));

    it('should call createServiceForTicket providing the current ticket', function () {
      const ctrl = this.createController();
      ctrl.createNewService();
      expect(this.serviceResource.createServiceForTicket).toHaveBeenCalledWith(this.ticket);
    });

    it('should add the new part to the ticket parts list', function () {
      const ctrl = this.createController();
      ctrl.createNewService();
      this.$scope.$digest();
      expect(this.ticket.services.length).toBe(1);
      expect(this.ticket.services[0].tech).toBe('Luke');
    });
  });

  describe('deleteService', function () {
    beforeEach(inject(function ($uibModal, Service) {
      this.$uibModal = $uibModal;
      spyOn($uibModal, 'open');

      this.service = new Service();
    }));

    it('should open a modal dialog with the correct options', function () {
      this.$uibModal.open.and.returnValue({ result: this.$q.resolve() });

      const ctrl = this.createController();
      ctrl.deleteService(this.service);

      expect(this.$uibModal.open).toHaveBeenCalled();
      expect(this.$uibModal.open.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({
        backdrop: 'static',
        keyboard: false,
        component: 'confirmDelete',
      }));
      expect(this.$uibModal.open.calls.mostRecent().args[0].resolve.type()).toBe('service call');
    });

    it('should mark the service as deleted only if the modal resolves', function () {
      const ctrl = this.createController();

      this.$uibModal.open.and.returnValue({ result: this.$q.reject() });
      ctrl.deleteService(this.service);

      this.$scope.$digest();

      expect(this.service.deleted).toBeFalsy();

      this.$uibModal.open.and.returnValue({ result: this.$q.resolve() });
      ctrl.deleteService(this.service);

      this.$scope.$digest();

      expect(this.service.deleted).toBeTruthy();
    });
  });
});
