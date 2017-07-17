'use strict';
'ngInject';

angular.module('appliancePointOfSale').component('basicSearch', {
  bindings: {
    searchOptions: '<',
  },
  controller: function ($element) {
    this.$onInit = () => {
      $element.find('#basic-search-text').focus();
    };

    this.setSearchType = (type) => {
      if (type === 'phoneNumber') {
        this.searchOptions.searchType = type;
      } else {
        this.searchOptions.searchType = 'lastName';
      }

      $element.find('#basic-search-text').focus();
    };
  },

  templateUrl: 'search-panel/basic-search/basic-search.tpl.html',
});
