'use strict';

describe('Directive: phoneTextInput', function () {
  beforeEach(module('appliancePointOfSale'));

  beforeEach(inject(function ($compile, $rootScope, $timeout) {
    this.$scope = $rootScope.$new();
    this.$timeout = $timeout;

    _.set(this.$scope, 'test.phoneText', '');

    this.element = $compile('<input type="text" ng-model="test.phoneText" phone-text-input>')(this.$scope);
    angular.element('body').append(this.element);

    this.$scope.$digest();
  }));

  describe('render', function () {
    it('should default to an empty string', function () {
      expect(this.element.val()).toBe('');
    });

    it('should handle updating the $scope value', function () {
      this.$scope.test.phoneText = '6698007';
      this.$scope.$digest();
      expect(this.element.val()).toBe('669-8007');
    });

    it('should handle area codes', function () {
      this.$scope.test.phoneText = '8606698007';
      this.$scope.$digest();
      expect(this.element.val()).toBe('(860) 669-8007');
    });

    it('should handle any text', function () {
      this.$scope.test.phoneText = 'c# 8606698007';
      this.$scope.$digest();
      expect(this.element.val()).toBe('c# 8606698007');
    });
  });

  describe('parse', function () {
    it('should default to an empty string', function () {
      expect(this.$scope.test.phoneText).toBe('');
    });

    it('should handle updating the the view value', function () {
      this.element.val('669-8007').trigger('input');
      this.$scope.$digest();
      expect(this.$scope.test.phoneText).toBe('6698007');
    });

    it('should handle area code numbers', function () {
      this.element.val('(860) 669-8007').trigger('input');
      this.$scope.$digest();
      expect(this.$scope.test.phoneText).toBe('8606698007');
    });

    it('should handle any text', function () {
      this.element.val('c# 669-8007').trigger('input');
      this.$scope.$digest();
      expect(this.$scope.test.phoneText).toBe('c# 669-8007');
    });
  });

  describe('keydown', function () {
    it('should not do anything for ignored keys', function () {
      this.element.val('6698007');
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

      expect(this.element.val()).toBe('6698007');
    });

    it('should update the view value', function () {
      this.element.val('6698007');
      const e = angular.element.Event('keydown');
      e.which = 15;
      this.element.trigger(e);
      this.$timeout.flush();

      expect(this.element.val()).toBe('669-8007');
    });

    it('should handle any text', function () {
      this.element.val('c# 6698007');
      const e = angular.element.Event('keydown');
      e.which = 15;
      this.element.trigger(e);
      this.$timeout.flush();

      expect(this.element.val()).toBe('c# 6698007');
    });
  });

  describe('paste cut', function () {
    it('should handle the "paste" event', function () {
      this.element.val('6698007');
      const e = angular.element.Event('paste');
      this.element.trigger(e);
      this.$timeout.flush();

      expect(this.element.val()).toBe('669-8007');
    });

    it('should handle the "cut" event', function () {
      this.element.val('6698007');
      const e = angular.element.Event('cut');
      this.element.trigger(e);
      this.$timeout.flush();

      expect(this.element.val()).toBe('669-8007');
    });
  });
});
