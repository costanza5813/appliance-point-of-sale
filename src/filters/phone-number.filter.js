'use strict';
'ngInject';

/* http://stackoverflow.com/questions/12700145/format-telephone-and-credit-card-numbers-in-angularjs */

angular.module('appliancePointOfSale').filter('phoneNumber', function() {
  return function (number) {
    if (!number) { return ''; }

    const value = number.toString().trim().replace(/^\+/, '');

    if (value.match(/[^0-9]/)) {
      return number;
    }

    let country;
    let areaCode;
    let baseNumber;

    switch (value.length) {
    case 5:
    case 6:
    case 7:
      country = 1;
      areaCode = '';
      baseNumber = value;
      break;

    case 8:
    case 9:
    case 10: // +1PPP####### -> C (PPP) ###-####
      country = 1;
      areaCode = value.slice(0, value.length - 7);
      baseNumber = value.slice(value.length - 7);
      break;

    case 11: // +CPPP####### -> CCC (PP) ###-####
      country = value[0];
      areaCode = value.slice(1, 4);
      baseNumber = value.slice(4);
      break;

    default:
      return number;
    }

    if (country == 1) {
      country = "";
    }

    baseNumber = baseNumber.slice(0, 3) + '-' + baseNumber.slice(3);

    return (country + " (" + areaCode + ") " + baseNumber).trim();
  };
});
