'use strict';
'ngInject';

angular.module('appliancePointOfSale').directive('currencyInput', function($filter, $browser) {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {

            function parse(viewValue, noRender) {
                if (!viewValue)
                    return viewValue;

                // strips all non digits leaving periods.
                let clean = viewValue.toString().replace(/[^0-9.]/g, '').replace(/\.{2,}/, '.');

                // case for users entering multiple periods throughout the number
                const dotSplit = clean.split('.');
                if (dotSplit.length >= 2) {
                    clean = dotSplit[0] + '.' + dotSplit[1].slice(0, 2);
                }

                if (!noRender) {
                    ngModel.$render();
                }

                return clean;
            }

            ngModel.$parsers.unshift(parse);

            ngModel.$render = () => {
                console.log('viewValue', ngModel.$viewValue);
                console.log('modelValue', ngModel.$modelValue);
                const clean = parse(ngModel.$viewValue, true);

                if (!clean) {
                    element.val('');
                    return;
                }

                let currencyValue;
                const dotSplit = clean.split('.');

                // todo: refactor, this is ugly
                if (clean.endsWith('.')) {
                    currencyValue = '$' + $filter('number')(parseFloat(clean)) + '.';
                } else if (clean.includes('.') && _.last(dotSplit).length === 1) {
                    currencyValue = '$' + $filter('number')(parseFloat(clean), 1);
                } else {
                    currencyValue = '$' + $filter('number')(parseFloat(clean));
                }

                console.log('clean', clean);
                console.log('currencyValue', currencyValue);

                element.val(currencyValue);
            };
        },
    };
});
