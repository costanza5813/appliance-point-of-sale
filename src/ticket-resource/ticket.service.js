'use strict';
'ngInject';

const dateFormat = 'l';

function ticketFactory(salesTaxCalculator) {
  class Ticket {
    static get defaults() {
      return {
        amountPaid: 0,
        balanceDue: 0,
        brand: '',
        customerComplaint: '',
        dateClosed: null,
        dateOpen: moment().format(dateFormat),
        dateStarted: null,
        item: '',
        model: '',
        serialNumber: '',
        serviceDescription: '',
        statusCode: 0,
        store: '',
        subtotal: 0,
        tax: 0,
        tech: '',
        total: 0,
      };
    }

    _updateTotals() {
      let debts = 0;
      let credits = 0;

      // sum all debts
      _.each(this._parts, (part) => {
        debts += part.total;
      });

      // sum all payments
      _.each(this._payments, (payment) => {
        credits += payment.paymentAmount;
      });

      const tax = salesTaxCalculator.calculateTax(debts, this._rawData.dateStarted);

      this._rawData.amountPaid = credits;
      this._rawData.balanceDue = (tax + debts) - credits;
      this._rawData.subtotal = debts;
      this._rawData.tax = tax;
      this._rawData.total = tax + debts;
    }

    constructor(rawData) {
      this._rawData = _.assign(Ticket.defaults, rawData);
      this._rawData.dateOpen = this._rawData.dateOpen || moment().format(dateFormat);

      this._parts = [];
      this._payments = [];
      this._services = [];

      this._updateTotals();
    }

    addPart(part) {
      this._parts.push(part);
      this._updateTotals();
    }

    addPayment(payment) {
      this._payments.push(payment);
      this._updateTotals();
    }

    addService(service) {
      this._services.push(service);
    }

    get rawData() {
      return this._rawData;
    }

    get parts() {
      return this._parts;
    }

    get payments() {
      return this._payments;
    }

    get services() {
      return this._services;
    }

    get updateTotals() {
      return this._updateTotals;
    }

    get id() {
      return this.selfHref.slice(this.selfHref.lastIndexOf('/') + 1);
    }

    get selfHref() {
      return _.get(this._rawData, '_links.self.href');
    }

    get partsHref() {
      return _.get(this._rawData, '_links.quotes.href');
    }

    get paymentsHref() {
      return _.get(this._rawData, '_links.payments.href');
    }

    get servicesHref() {
      return _.get(this._rawData, '_links.serviceCalls.href');
    }

    get amountPaid() {
      return this._rawData.amountPaid;
    }

    get balanceDue() {
      return this._rawData.balanceDue;
    }

    get brand() {
      return this._rawData.brand;
    }

    set brand(brand) {
      this._rawData.brand = brand;
    }

    get customerComplaint() {
      return this._rawData.customerComplaint;
    }

    set customerComplaint(customerComplaint) {
      this._rawData.customerComplaint = customerComplaint;
    }

    get dateOpen() {
      return this._rawData.dateOpen;
    }

    get item() {
      return this._rawData.item;
    }

    set item(item) {
      this._rawData.item = item;
    }

    get model() {
      return this._rawData.model;
    }

    set model(model) {
      this._rawData.model = model;
    }

    get serialNumber() {
      return this._rawData.serialNumber;
    }

    set serialNumber(serialNumber) {
      this._rawData.serialNumber = serialNumber;
    }

    get serviceDescription() {
      return this._rawData.serviceDescription;
    }

    set serviceDescription(serviceDescription) {
      this._rawData.serviceDescription = serviceDescription;
    }

    get store() {
      return this._rawData.store;
    }

    set store(store) {
      this._rawData.store = store;
    }

    get subtotal() {
      return this._rawData.subtotal;
    }

    get tax() {
      return this._rawData.tax;
    }

    get tech() {
      return this._rawData.tech;
    }

    set tech(tech) {
      this._rawData.tech = tech;
    }

    get total() {
      return this._rawData.total;
    }
  }
  return Ticket;
}

angular.module('appliancePointOfSale').factory('Ticket', ticketFactory);
