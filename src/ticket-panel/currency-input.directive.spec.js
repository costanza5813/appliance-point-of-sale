'use strict';

describe('Directive: currencyInput', function () {
  beforeEach(module('appliancePointOfSale'));

  beforeEach(inject(function ($compile, $rootScope) {
    this.$scope = $rootScope.$new();
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

  xdescribe('parse', function () {
    it('should default to 0', function () {
      expect(this.$scope.test.price).toBe(0);
    });

    it('should handle updating the the view value', function () {
      this.element.text('$199.99');
      this.$scope.$digest();
      expect(this.$scope.test.price).toBe(199.99);
    });

    it('should handle negative numbers', function () {
      this.element.text('-$199.99');
      this.$scope.$digest();
      expect(this.$scope.test.price).toBe(-199.99);
    });
  });
});
