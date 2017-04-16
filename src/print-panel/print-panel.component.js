'use strict';
'ngInject';

angular.module('appliancePointOfSale').component('printPanel', {
  bindings: {
  },
  controller: function($state, $timeout, $window, currentSelections) {

    this.customer = currentSelections.customer;
    this.ticket = currentSelections.ticket;

    $timeout(() => {
      //kdj TODO
      // $window.print();
      // $state.go('^');
    });
  },
  templateUrl: 'print-panel/print-panel.tpl.html'
});
