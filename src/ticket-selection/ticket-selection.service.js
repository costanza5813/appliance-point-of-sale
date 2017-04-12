'use strict';
'ngInject';

const injected = {};
const newTicketId = '%new-ticket%';
const dateFormat = 'l';

class Ticket {
  constructor(rawData) {
    this._rawData = rawData || {};
    this._id = this._rawData.invoiceNumber || newTicketId;
  }

  isNewTicket() {
    return this._id === newTicketId;
  }

  get id() {
    return this._id;
  }

  get invoiceNumber() {
    return this._rawData.invoiceNumber || 'invoice-123456';
  }

  get date() {
    return moment(this._rawData.date).format(dateFormat);
  }
}

class TicketSelection {
  constructor($q, $timeout) {
    injected.$q = $q;
    injected.$timeout = $timeout;

    this._current = new Ticket();
  }

  getTicketsForCustomer(customer) {
    angular.noop(customer);
    const deferred = injected.$q.defer();

    injected.$timeout(() => {
      const tickets = [
        new Ticket('0'),
        new Ticket('1'),
      ];

      for (let i = 0; i < 10; i++) {
        tickets.push(new Ticket((i+2).toString()));
      }
      deferred.resolve(tickets);
    }, 2000);

    return deferred.promise;
  }

  createNewTicket() {
    this._current = new Ticket();
  }


  get current() {
    return this._current;
  }

  set current(ticket) {
    this._current = ticket || new Ticket();
  }
}

angular.module('appliancePointOfSale').factory('ticketSelection', TicketSelection);
