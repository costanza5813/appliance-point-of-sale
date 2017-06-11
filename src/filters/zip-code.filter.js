'use strict';
'ngInject';

angular.module('appliancePointOfSale').filter('zipCode', function () {
  return function (code) {
    if (!code) { return ''; }

    const value = code.replace(/[^0-9]/g, '');

    // uncomment this when zip codes are strings
    // switch (value.length) {
    // case 0:
    // case 1:
    // case 2:
    // case 3:
    // case 4:
    // case 5:
    //   return value;
    // default:
    //   const zipCode = value.slice(0, 5);
    //   const plusFour = value.slice(5, 9);
    //   return zipCode + '-' + plusFour;
    // }

    return value.slice(0, 5);
  };
});
