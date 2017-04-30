'use strict';
'ngInject';

class CurrentSelections {
  constructor($q, Customer, customerResource, partResource, paymentResource, serviceResource, Ticket, ticketResource) {
    this._customer = new Customer();
    this._ticket = new Ticket();

    this._customerSaved = _.cloneDeep(this._customer);
    this._ticketSaved = _.cloneDeep(this._ticket);

    this.$q = $q;

    this.customerResource = customerResource;
    this.partResource = partResource;
    this.paymentResource = paymentResource;
    this.serviceResource = serviceResource;
    this.ticketResource = ticketResource;
  }

  save() {
    if (!this.hasUnsavedChanges()) {
      return this.$q.resolve();
    }

    const promises = [
      this.customerResource.updateCustomer(this._customer),
      this.ticketResource.updateTicket(this._ticket),
    ];

    _.each(this._ticket.parts, (part) => {
      promises.push(this.partResource.updatePart(part));
    });

    _.each(this._ticket.payments, (payment) => {
      promises.push(this.paymentResource.updatePayment(payment));
    });

    _.each(this._ticket.services, (service) => {
      promises.push(this.serviceResource.updateService(service));
    });

    return this.$q.all(promises).then(() => {
      this._customerSaved = _.cloneDeep(this._customer);
      this._ticketSaved = _.cloneDeep(this._ticket);
    });
  }

  hasUnsavedChanges() {
    return !_.isEqual(this._customer.rawData, this._customerSaved.rawData) ||
      !_.isEqual(this._ticket.rawData, this._ticketSaved.rawData);
  }

  get customer() {
    return this._customer;
  }

  set customer(customer) {
    this._customer = customer;
    this._customerSaved = _.cloneDeep(this._customer);
  }

  get ticket() {
    return this._ticket;
  }

  set ticket(ticket) {
    this._ticket = ticket;
    this._ticketSaved = _.cloneDeep(this._ticket);
  }
}

angular.module('appliancePointOfSale').factory('currentSelections', CurrentSelections);
