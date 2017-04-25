'use strict';
'ngInject';

class Part {
  static get defaults() {
    return {
      brand: '',
      description: '',
      partNum: '',
      price: 0,
      quantity: 0,
      total: 0,
    };
  }

  _updateTotal() {
    this._rawData.total = this._rawData.price * this._rawData.quantity;

    if(_.isFunction(this._updateTicket)) {
      this._updateTicket();
    }
  }

  constructor(rawData, updateTicketFunc) {
    this._rawData = _.assign(Part.defaults, rawData);
    this._updateTicket = updateTicketFunc;
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

  get brand() {
    return this._rawData.brand;
  }

  set brand(brand) {
    this._rawData.brand = brand;
  }

  get description() {
    return this._rawData.description;
  }

  set description(description) {
    this._rawData.description = description;
  }

  get partNum() {
    return this._rawData.partNum;
  }

  set partNum(partNum) {
    this._rawData.partNum = partNum;
  }

  get price() {
    return this._rawData.price;
  }

  set price(price) {
    this._rawData.price = parseFloat(price);
    this._updateTotal();
  }

  get quantity() {
    return this._rawData.quantity;
  }

  set quantity(quantity) {
    this._rawData.quantity = quantity;
    this._updateTotal();
  }

  get total() {
    return this._rawData.total;
  }
}

angular.module('appliancePointOfSale').factory('Part', () => Part);
