'use strict';
'ngInject';

const dateFormat = 'L';

const baseUri = '/ShoreTVCustomers/ServiceTickets/tickets/';

function ticketFactory(Payment, salesTaxCalculator) {
  class Ticket {
    static get defaults() {
      return {
        amountPaid: 0,
        balanceDue: 0,
        billingAddress: '',
        billingCity: '',
        billingLastName: '',
        billingName: '',
        billingPhone1: '',
        billingPhone2: '',
        billingState: '',
        billingZip: '',
        brand: '',
        customerComplaint: '',
        dateClosed: null,
        dateOfPurchase: null,
        dateOpen: moment().format(dateFormat),
        dateStarted: null,
        item: '',
        model: '',
        salesperson: '',
        serialNumber: '',
        serviceDescription: '',
        statusCode: 0,
        store: '',
        subtotal: 0,
        tax: 0,
        taxable: true,
        tech: '',
        total: 0,
      };
    }

    _updateTotals() {
      let debts = 0;
      let credits = 0;
      let isWarranty = false;

      // sum all debts
      _.each(this._parts, (part) => {
        if (part.deleted) {
          return true;
        }

        debts = debts ? debts + part.total : part.total;
      });

      // sum all payments
      _.each(this._payments, (payment) => {
        if (payment.deleted) {
          return true;
        }

        if (payment.paymentType === Payment.ePaymentTypes.warranty.value) {
          isWarranty = true;
        }

        credits = credits ? credits + payment.paymentAmount : payment.paymentAmount;
      });

      const tax = this._rawData.taxable ? salesTaxCalculator.calculateTax(debts, this._rawData.dateStarted) : 0;

      this._rawData.amountPaid = isWarranty ? 0 : credits;
      this._rawData.balanceDue = isWarranty ? 0 : (tax + debts) - credits;
      this._rawData.subtotal = debts;
      this._rawData.tax = tax;
      this._rawData.total = tax + debts;
    }

    constructor(rawData) {
      this._rawData = _.assign(Ticket.defaults, rawData);

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
      return _.get(this._rawData, '_links.self.href', baseUri + (this._rawData.idtickets || ''));
    }

    get partsHref() {
      return _.get(this._rawData, '_links.quotes.href', baseUri + this._rawData.idtickets + '/quotes');
    }

    get paymentsHref() {
      return _.get(this._rawData, '_links.payments.href', baseUri + this._rawData.idtickets + '/payments');
    }

    get servicesHref() {
      return _.get(this._rawData, '_links.serviceCalls.href', baseUri + this._rawData.idtickets + '/serviceCalls');
    }

    get customerHref() {
      const ticketsCustomerUri = '/ShoreTVCustomers/ServiceTickets/ticketsCustomer/';
      return _.get(this._rawData, '_links.customer.href', ticketsCustomerUri + this._rawData.idtickets + '/customer');
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

    get salesperson() {
      return this._rawData.salesperson;
    }

    set salesperson(salesperson) {
      this._rawData.salesperson = salesperson;
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

    get taxable() {
      return this._rawData.taxable;
    }

    set taxable(taxable) {
      this._rawData.taxable = taxable;
      this._updateTotals();
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

    get billingName() {
      return this._rawData.billingName;
    }

    set billingName(billingName) {
      this._rawData.billingName = billingName;
    }

    get billingLastName() {
      return this._rawData.billingLastName;
    }

    set billingLastName(billingLastName) {
      this._rawData.billingLastName = billingLastName;
    }

    get billingAddress() {
      return this._rawData.billingAddress;
    }

    set billingAddress(billingAddress) {
      this._rawData.billingAddress = billingAddress;
    }

    get billingCity() {
      return this._rawData.billingCity;
    }

    set billingCity(billingCity) {
      this._rawData.billingCity = billingCity;
    }

    get billingState() {
      return this._rawData.billingState;
    }

    set billingState(billingState) {
      this._rawData.billingState = billingState;
    }

    get billingZip() {
      return this._rawData.billingZip;
    }

    set billingZip(billingZip) {
      this._rawData.billingZip = billingZip;
    }

    get billingPhone1() {
      return this._rawData.billingPhone1;
    }

    set billingPhone1(billingPhone1) {
      this._rawData.billingPhone1 = billingPhone1;
    }

    get billingPhone2() {
      return this._rawData.billingPhone2;
    }

    set billingPhone2(billingPhone2) {
      this._rawData.billingPhone2 = billingPhone2;
    }

    get dateOfPurchase() {
      return this._rawData.dateOfPurchase;
    }

    set dateOfPurchase(dateOfPurchase) {
      this._rawData.dateOfPurchase = dateOfPurchase;
    }
  }
  return Ticket;
}

angular.module('appliancePointOfSale').factory('Ticket', ticketFactory);
