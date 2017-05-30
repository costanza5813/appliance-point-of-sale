'use strict';
'ngInject';

angular.module('appliancePointOfSale').directive('currencyInput', function($filter, $browser) {
  return {
    require: 'ngModel',
    link: function($scope, $element, $attrs, ngModelCtrl) {
      const listener = () => {
        const sign = $element.val().charAt(0) === '-' ? '-' : '';
        let value = $element.val().replace(/[^0-9]/g, '');
        value = sign + value.slice(0, value.length - 2) + '.' + value.slice(value.length - 2);
        $element.val($filter('currency')(parseFloat(value)));
      };

      // This runs when we update the text field
      ngModelCtrl.$parsers.push((viewValue) => {
        const sign = viewValue.charAt(0) === '-' ? '-' : '';
        let value = viewValue.replace(/[^0-9]/g, '');
        value = sign + value.slice(0, value.length - 2) + '.' + value.slice(value.length - 2);
        return parseFloat(value);
      });

      // This runs when the model gets updated on the scope directly and keeps our view in sync
      ngModelCtrl.$render = () => {
        $element.val($filter('currency')(parseFloat(ngModelCtrl.$viewValue)));
      };

      $element.bind('change', listener);
      $element.bind('keydown', (event) => {
        var key = event.keyCode;
        // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
        // This lets us support copy and paste too
        if (key === 91 || (15 < key && key < 19) || (37 <= key && key <= 40)){
          return;
        }
        $browser.defer(listener); // Have to do this or changes don't get picked up properly
      });

      $element.bind('paste cut', function() {
        $browser.defer(listener);
      });
    }
  };
});
