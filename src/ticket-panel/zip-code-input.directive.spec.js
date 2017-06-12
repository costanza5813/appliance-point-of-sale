'use strict';

describe('Directive: zipCodeInput', function () {
  beforeEach(module('appliancePointOfSale'));

  beforeEach(inject(function ($compile, $rootScope, $timeout) {
    this.$scope = $rootScope.$new();
    this.$timeout = $timeout;

    _.set(this.$scope, 'test.zipCode', '');

    this.element = $compile('<input type="text" ng-model="test.zipCode" zip-code-input>')(this.$scope);
    angular.element('body').append(this.element);

    this.$scope.$digest();
  }));

  describe('render', function () {
    it('should default to an empty string', function () {
      expect(this.element.val()).toBe('');
    });

    it('should handle updating the $scope value', function () {
      this.$scope.test.zipCode = '06413';
      this.$scope.$digest();
      expect(this.element.val()).toBe('06413');
    });

    it('should handle zip codes shorter than 5 digits', function () {
      this.$scope.test.zipCode = '0641';
      this.$scope.$digest();
      expect(this.element.val()).toBe('0641');
    });
  });

  describe('parse', function () {
    it('should default to an empty string', function () {
      expect(this.$scope.test.zipCode).toBe('');
    });

    it('should handle updating the the view value', function () {
      this.element.val('06413').trigger('input');
      this.$scope.$digest();
      expect(this.$scope.test.zipCode).toBe('06413');
    });

    it('should handle zip codes shorter than 5 digits', function () {
      this.element.val('0641').trigger('input');
      this.$scope.$digest();
      expect(this.$scope.test.zipCode).toBe('00641');
    });

    it('should handle zip codes longer than 5 digits', function () {
      this.element.val('064133').trigger('input');
      this.$scope.$digest();
      expect(this.$scope.test.zipCode).toBe('06413');
    });

    it('should handle zip codes with bad chararcters', function () {
      this.element.val('064bc1$3').trigger('input');
      this.$scope.$digest();
      expect(this.$scope.test.zipCode).toBe('06413');
    });
  });

  describe('keydown', function () {
    it('should not do anything for ignored keys', function () {
      this.element.val('06a');
      const e = angular.element.Event('keydown');
      e.which = 91;
      this.element.trigger(e);
      this.$scope.$digest();

      e.which = 16;
      this.element.trigger(e);
      this.$scope.$digest();

      e.which = 37;
      this.element.trigger(e);
      this.$scope.$digest();

      expect(this.element.val()).toBe('06a');
    });

    it('should update the view value', function () {
      this.element.val('06413');
      const e = angular.element.Event('keydown');
      e.which = 15;
      this.element.trigger(e);
      this.$timeout.flush();

      expect(this.element.val()).toBe('06413');
    });
  });

  describe('paste cut', function () {
    it('should handle the "paste" event', function () {
      this.element.val('06413');
      const e = angular.element.Event('paste');
      this.element.trigger(e);
      this.$timeout.flush();

      expect(this.element.val()).toBe('06413');
    });

    it('should handle the "cut" event', function () {
      this.element.val('06413');
      const e = angular.element.Event('cut');
      this.element.trigger(e);
      this.$timeout.flush();

      expect(this.element.val()).toBe('06413');
    });
  });
});
