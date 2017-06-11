'use strict';
'ngInject';

class Customer {
  static get defaults() {
    return {
      address: '',
      city: '',
      email: '',
      firstName: '',
      lastName: '',
      legacyCustomerID: '',
      phoneNumber: 0,
      state: '',
      workNumber: '',
      zip: '',
    };
  }

  constructor(rawData) {
    this._rawData = _.assign(Customer.defaults, rawData);
    this._tickets = [];
  }

  addTicket(ticket) {
    this._tickets.push(ticket);
  }

  get rawData() {
    return this._rawData;
  }

  get tickets() {
    return this._tickets;
  }

  get id() {
    const selfHref = this.selfHref;
    if (!selfHref) {
      return undefined;
    }

    return selfHref.slice(selfHref.lastIndexOf('/') + 1);
  }

  get selfHref() {
    return _.get(this._rawData, '_links.self.href');
  }

  get ticketsHref() {
    return _.get(this._rawData, '_links.tickets.href');
  }

  get address() {
    return this._rawData.address;
  }

  set address(address) {
    this._rawData.address = address;
  }

  get city() {
    return this._rawData.city;
  }

  set city(city) {
    this._rawData.city = city;
  }

  get firstName() {
    return this._rawData.firstName;
  }

  set firstName(firstName) {
    this._rawData.firstName = firstName;
  }

  get lastName() {
    return this._rawData.lastName;
  }

  set lastName(lastName) {
    this._rawData.lastName = lastName;
  }

  get phoneNumber() {
    return this._rawData.phoneNumber;
  }

  set phoneNumber(phoneNumber) {
    this._rawData.phoneNumber = phoneNumber;
  }

  get state() {
    return this._rawData.state;
  }

  set state(state) {
    this._rawData.state = state;
  }

  get workNumber() {
    return this._rawData.workNumber;
  }

  set workNumber(workNumber) {
    this._rawData.workNumber = workNumber;
  }

  get zip() {
    return this._rawData.zip;
  }

  set zip(zip) {
    var pad = '0000';
    this._rawData.zip = pad.substring(0, pad.length - zip.length) + zip;
  }
}
angular.module('appliancePointOfSale').factory('Customer', () => Customer);
