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

  _isEqual(current, saved) {
    if (current.length !== saved.length) {
      return false;
    }

    for (var i = 0; i < current.length; i++) {
      if (!_.isEqual(current[i].rawData, saved[i].rawData) || current[i].deleted !== saved[i].deleted) {
        return false;
      }
    }

    return true;
  }

  save() {
    if (!this.hasUnsavedChanges()) {
      return this.$q.resolve();
    }

    const promises = [
      this.customerResource.updateCustomer(this._customer),
      this.ticketResource.updateTicket(this._ticket),
    ];

    const deletedParts = _.remove(this._ticket.parts, (part) => part.deleted);
    const deletedPayments = _.remove(this._ticket.payments, (payment) => payment.deleted);
    const deletedServices = _.remove(this._ticket.services, (service) => service.deleted);

    // Do Updates
    _.each(this._ticket.parts, (part) => {
      promises.push(this.partResource.updatePart(part));
    });

    _.each(this._ticket.payments, (payment) => {
      promises.push(this.paymentResource.updatePayment(payment));
    });

    _.each(this._ticket.services, (service) => {
      promises.push(this.serviceResource.updateService(service));
    });

    // Do Deletions
    _.each(deletedParts, (part) => {
      promises.push(this.partResource.deletePart(part));
    });

    _.each(deletedPayments, (payment) => {
      promises.push(this.paymentResource.deletePayment(payment));
    });

    _.each(deletedServices, (service) => {
      promises.push(this.serviceResource.deleteService(service));
    });

    return this.$q.all(promises).then(() => {
      this._customerSaved = _.cloneDeep(this._customer);
      this._ticketSaved = _.cloneDeep(this._ticket);
    });
  }

  hasUnsavedChanges() {
    return !_.isEqual(this._customer.rawData, this._customerSaved.rawData) ||
      !_.isEqual(this._ticket.rawData, this._ticketSaved.rawData) ||
      !this._isEqual(this._ticket.parts, this._ticketSaved.parts) ||
      !this._isEqual(this._ticket.payments, this._ticketSaved.payments) ||
      !this._isEqual(this._ticket.services, this._ticketSaved.services);
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

angular.module('appliancePointOfSale').service('currentSelections', CurrentSelections);
