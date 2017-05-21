'use strict';
'ngInject';

angular.module('appliancePointOfSale').component('confirmDelete', {
  bindings: {
    modalInstance: '<',
    resolve: '<',
  },
  controller: function() {
    this.$onInit = () => {
      this.type = this.resolve.type;
    };

    this.onCancel = () => {
      this.modalInstance.dismiss();
    };

    this.onDelete = () => {
      this.modalInstance.close();
    };

    this.properCaseType = () => {
      return _.startCase(this.type);
    };
  },
  templateUrl: 'confirm-delete/confirm-delete.tpl.html'
});
