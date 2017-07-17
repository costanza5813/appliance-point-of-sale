'use strict';
'ngInject';

angular.module('appliancePointOfSale').component('advancedSearch', {
  bindings: {
    modalInstance: '<',
    resolve: '<',
  },
  controller: function () {
    this.$onInit = () => {
      this.searchOptions = this.resolve.searchOptions;
    };

    this.close = () => {
      this.modalInstance.dismiss();
    };
  },

  templateUrl: 'search-panel/advanced-search/advanced-search.tpl.html',
});
