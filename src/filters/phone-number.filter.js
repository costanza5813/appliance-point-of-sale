'use strict';
'ngInject';

angular.module('appliancePointOfSale').filter('phoneNumber', function() {
  return function (number) {
    if (!number) { return ''; }

    const value = number.toString().trim().replace(/[^0-9]/, '');

    switch (value.length) {
    case 0:
    case 1:
    case 2:
    case 3:
      return value;

    case 4:
    case 5:
    case 6:
    case 7:
      return value.slice(0, 3) + '-' + value.slice(3);

    default:
      const base = value.slice(3);
      return '(' + value.slice(0, 3) + ') ' + base.slice(0, 3) + '-' + base.slice(3, 7);
    }
  };
});
