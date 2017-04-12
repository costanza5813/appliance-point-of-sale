'use strict';
'ngInject';

angular.module('appliancePointOfSale').filter('phoneNumber', function() {
    return function (number) {
        if (!number) { return ''; }

        const value = number.toString().trim().replace(/[^0-9]/, '');

        let areaCode;
        let base;

        switch (value.length) {
        case 1:
        case 2:
        case 3:
            areaCode = value;
            break;

        default:
            areaCode = value.slice(0, 3);
            base = value.slice(3);
        }

        if(base){
            if(base.length>3){
                base = base.slice(0, 3) + '-' + base.slice(3,7);
            }
            else{
                base = base;
            }

            return ("(" + areaCode + ") " + base).trim();
        }
        else{
            return "(" + areaCode;
        }
    };
});
