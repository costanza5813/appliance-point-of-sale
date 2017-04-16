'use strict';
'ngInject';

angular.module('appliancePointOfSale').component('welcome', {
  bindings: {
  },
  controller: function(snapRemote) {
    snapRemote.open('left');

    const hour = moment().hour();
    if (hour < 12) {
      this.partOfDay = 'morning';
    } else if (hour < 17) {
      this.partOfDay = 'afternoon';
    } else {
      this.partOfDay = 'evening';
    }
  },
  templateUrl: 'welcome/welcome.tpl.html'
});
