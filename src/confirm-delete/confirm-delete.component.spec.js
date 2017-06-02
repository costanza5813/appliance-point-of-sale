describe('Component: confirmDelte', function() {
  beforeEach(module('appliancePointOfSale'));

  beforeEach(inject(function($componentController){
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

  describe('$onInit', function() {
    it('should set the type from the resolve binding', function() {
      const ctrl = this.createController();
      expect(ctrl.type).toBe('some type');
    });
  });
});
