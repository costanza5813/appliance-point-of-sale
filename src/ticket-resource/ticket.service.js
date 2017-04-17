'use strict';
'ngInject';

const dateFormat = 'l';

const baseUri = '/ShoreTVCustomers/ServiceTickets/tickets/';

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
      if (this.selfHref) {
        return this.selfHref.slice(this.selfHref.lastIndexOf('/') + 1);
      } else if (this.idtickets) {
        return this._rawData.idtickets; 
      }
    }

    get selfHref() {
      if (_.get(this._rawData, '_links.self.href')) {
        return _.get(this._rawData, '_links.self.href');
      } else {
        return baseUri + this._rawData.idtickets;
      }  
    }

    get partsHref() {
      if (_.get(this._rawData, '_links.quotes.href')) {
        return _.get(this._rawData, '_links.quotes.href');
      } else {
        return baseUri + this._rawData.idtickets + '/quotes';
      }
    }

    get paymentsHref() {
      if (_.get(this._rawData, '_links.payments.href')) {
        return _.get(this._rawData, '_links.payments.href');
      } else {
        return baseUri + this._rawData.idtickets + '/payments';
      }
    }

    get servicesHref() {
      if (_.get(this._rawData, '_links.serviceCalls.href')) {
        return _.get(this._rawData, '_links.serviceCalls.href');
      } else {
        return baseUri + this._rawData.idtickets + '/serviceCalls';
      }
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
