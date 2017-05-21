'use strict';
'ngInject';

class Payment {

  static get ePaymentTypes() {
    return {
      gcaf:     { value: 0, display: 'GCAF' },
      cod:      { value: 1, display: 'COD / Other' },
      charge:   { value: 2, display: 'Credit' },
      check:    { value: 3, display: 'Check' },
      cash:     { value: 4, display: 'Cash' },
      warranty: { value: 5, display: 'Warranty' },
    };
  }

  static get defaults() {
    return {
      checkNumber: '',
      paymentAmount: 0,
      paymentDate: '',
      paymentType: 0,
      reconciled: true,
      reconciledNotes: '',
    };
  }

  constructor(rawData, updateTicketFunc) {
    this._rawData = _.assign(Payment.defaults, rawData);
    this._updateTicket = updateTicketFunc;
    this._deleted = false;
  }

  get rawData() {
    return this._rawData;
  }

  get id() {
    return this.selfHref.slice(this.selfHref.lastIndexOf('/') + 1);
  }

  get selfHref() {
    return _.get(this._rawData, '_links.self.href');
  }

  get checkNumber() {
    return this._rawData.checkNumber;
  }

  set checkNumber(checkNumber) {
    this._rawData.checkNumber = checkNumber;
  }

  get paymentType() {
    return this._rawData.paymentType;
  }

  set paymentType(paymentType) {
    this._rawData.paymentType = parseInt(paymentType);

    if(_.isFunction(this._updateTicket)) {
      this._updateTicket();
    }
  }

  get paymentDate() {
    return this._rawData.paymentDate;
  }

  set paymentDate(paymentDate) {
    this._rawData.paymentDate = paymentDate;
  }

  get paymentAmount() {
    return this._rawData.paymentAmount;
  }

  set paymentAmount(paymentAmount) {
    this._rawData.paymentAmount = parseFloat(paymentAmount);

    if(_.isFunction(this._updateTicket)) {
      this._updateTicket();
    }
  }

  get reconciledNotes() {
    return this._rawData.reconciledNotes;
  }

  set reconciledNotes(reconciledNotes) {
    this._rawData.reconciledNotes = reconciledNotes;
  }

  get deleted() {
    return this._deleted;
  }

  set deleted(deleted) {
    this._deleted = deleted;

    if(_.isFunction(this._updateTicket)) {
      this._updateTicket();
    }
  }
}
angular.module('appliancePointOfSale').factory('Payment', () => Payment);
