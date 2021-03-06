'use strict';

describe('Directive: currencyInput', function () {
  beforeEach(module('appliancePointOfSale'));

  beforeEach(inject(function ($compile, $rootScope, $timeout) {
    this.$scope = $rootScope.$new();
    this.$timeout = $timeout;

    _.set(this.$scope, 'test.price', 0);

    this.element = $compile('<input type="text" ng-model="test.price" currency-input>')(this.$scope);
    angular.element('body').append(this.element);

    this.$scope.$digest();
  }));

  describe('render', function () {
    it('should default to $0.00', function () {
      expect(this.element.val()).toBe('$0.00');
    });

    it('should handle updating the $scope value', function () {
      this.$scope.test.price = 199.99;
      this.$scope.$digest();
      expect(this.element.val()).toBe('$199.99');
    });

    it('should handle negative numbers', function () {
      this.$scope.test.price = -199.99;
      this.$scope.$digest();
      expect(this.element.val()).toBe('-$199.99');
    });
  });

  describe('parse', function () {
    it('should default to 0', function () {
      expect(this.$scope.test.price).toBe(0);
    });

    it('should handle updating the the view value', function () {
      this.element.val('$199.99').trigger('input');
      this.$scope.$digest();
      expect(this.$scope.test.price).toBe(199.99);
    });

    it('should handle negative numbers', function () {
      this.element.val('-$199.99').trigger('input');
      this.$scope.$digest();
      expect(this.$scope.test.price).toBe(-199.99);
    });

    it('should handle single digit numbers', function () {
      this.element.val('1').trigger('input');
      this.$scope.$digest();
      expect(this.$scope.test.price).toBe(0.01);
    });

    it('should handle bad characters', function () {
      this.element.val('1abc$2').trigger('input');
      this.$scope.$digest();
      expect(this.$scope.test.price).toBe(0.12);
    });
  });

  describe('keydown', function () {
    it('should not do anything for ignored keys', function () {
      this.element.val('199');
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

      expect(this.element.val()).toBe('199');
    });

    it('should update the view value', function () {
      this.element.val('199');
      const e = angular.element.Event('keydown');
      e.which = 15;
      this.element.trigger(e);
      this.$timeout.flush();

      expect(this.element.val()).toBe('$1.99');
    });
  });

  describe('paste cut', function () {
    it('should handle the "paste" event', function () {
      this.element.val('199');
      const e = angular.element.Event('paste');
      this.element.trigger(e);
      this.$timeout.flush();

      expect(this.element.val()).toBe('$1.99');
    });

    it('should handle the "cut" event', function () {
      this.element.val('199');
      const e = angular.element.Event('cut');
      this.element.trigger(e);
      this.$timeout.flush();

      expect(this.element.val()).toBe('$1.99');
    });
  });
});
