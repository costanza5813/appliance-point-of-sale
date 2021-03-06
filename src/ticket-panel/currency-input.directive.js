'use strict';
'ngInject';

angular.module('appliancePointOfSale').directive('currencyInput', function ($filter, $timeout) {
  return {
    require: 'ngModel',
    link: function ($scope, $element, $attrs, ngModelCtrl) {
      const formatNumber = (number) => {
        const sign = number.charAt(0) === '-' ? '-' : '';
        let value = number.replace(/[^0-9]/g, '');
        value = value.length === 1 ? '0' + value : value;
        return sign + value.slice(0, value.length - 2) + '.' + value.slice(value.length - 2);
      };

      const listener = () => {
        $element.val($filter('currency')(parseFloat(formatNumber($element.val()))));
      };

      // This runs when we update the text field
      ngModelCtrl.$parsers.push((viewValue) => {
        return parseFloat(formatNumber(viewValue));
      });

      // This runs when the model gets updated on the scope directly and keeps our view in sync
      ngModelCtrl.$render = () => {
        $element.val($filter('currency')(parseFloat(ngModelCtrl.$viewValue)));
      };

      $element.bind('change', listener);
      $element.bind('keydown', (event) => {
        const key = event.which;

        // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
        // This lets us support copy and paste too
        if (key === 91 || (15 < key && key < 19) || (37 <= key && key <= 40)) {
          return;
        }

        $timeout(listener); // Have to do this or changes don't get picked up properly
      });

      $element.bind('paste cut', function () {
        $timeout(listener);
      });
    },
  };
});
