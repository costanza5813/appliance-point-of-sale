'use strict';
'ngInject';

angular.module('appliancePointOfSale').component('confirmUnsavedChanges', {
  bindings: {
    modalInstance: '<',
  },
  controller: function () {
    this.onDiscard = () => {
      this.modalInstance.dismiss();
    };

    this.onSave = () => {
      this.modalInstance.close();
    };
  },

  templateUrl: 'confirm-unsaved-changes/confirm-unsaved-changes.tpl.html',
});
