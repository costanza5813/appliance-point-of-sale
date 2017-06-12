'use strict';
'ngInject';

angular.module('appliancePointOfSale').directive('zipCodeInput', function ($filter, $timeout) {
  return {
    require: 'ngModel',
    link: function ($scope, $element, $attrs, ngModelCtrl) {
      const listener = () => {
        $element.val($filter('zipCode')($element.val()));
      };

      // This runs when we update the text field
      ngModelCtrl.$parsers.push((viewValue) => {
        const value = viewValue.replace(/[^0-9]/g, '');
        let zipCode = '00000';
        if (value.length <= 5) {
          zipCode = zipCode.slice(0, 5 - value.length) + value;
        } else {
          zipCode = value.slice(0, 5);

          // uncomment this when zip codes are strings
          // zipCode = value.slice(0, 5) + '-' + value.slice(5, 9);
        }

        return zipCode;
      });

      // This runs when the model gets updated on the scope directly and keeps our view in sync
      ngModelCtrl.$render = () => {
        $element.val($filter('zipCode')(ngModelCtrl.$viewValue));
      };

      $element.bind('change', listener);
      $element.bind('keydown', (event) => {
        var key = event.which;

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
