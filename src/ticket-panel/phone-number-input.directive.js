'use strict';
'ngInject';

angular.module('appliancePointOfSale').directive('phoneNumberInput', function ($filter, $timeout) {
  return {
    require: 'ngModel',
    link: function ($scope, $element, $attrs, ngModelCtrl) {
      const listener = () => {
        const value = $element.val().replace(/[^0-9]/g, '');
        $element.val($filter('phoneNumber')(value));
      };

      // This runs when we update the text field
      ngModelCtrl.$parsers.push((viewValue) => {
        return viewValue.replace(/[^0-9]/g, '').slice(0, 10);
      });

      // This runs when the model gets updated on the scope directly and keeps our view in sync
      ngModelCtrl.$render = () => {
        $element.val($filter('phoneNumber')(ngModelCtrl.$viewValue));
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
