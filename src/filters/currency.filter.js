'use strict';
'ngInject';

angular.module('appliancePointOfSale').filter('currency', function () {
  return function (number) {
    if (!number) { return '$0.00'; }

    const sign = number.toFixed(2).charAt(0) === '-' ? '-' : '';
    const value = number.toFixed(2).trim().replace(/[^0-9]/g, '');

    const dollars = value.slice(0, value.length - 2);
    const cents = value.slice(value.length - 2);
    return sign + '$' + dollars + '.' + cents;
  };
});
