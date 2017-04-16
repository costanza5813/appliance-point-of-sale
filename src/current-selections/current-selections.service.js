'use strict';
'ngInject';

class CurrentSelections {
  constructor(Customer, Ticket) {
    this._customer = new Customer();
    this._ticket = new Ticket();
  }

  get customer() {
    return this._customer;
  }

  set customer(customer) {
    this._customer = customer;
  }

  get ticket() {
    return this._ticket;
  }

  set ticket(ticket) {
    this._ticket = ticket;
  }
}

angular.module('appliancePointOfSale').factory('currentSelections', CurrentSelections);
