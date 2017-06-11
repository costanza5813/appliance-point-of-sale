'use strict';

describe('Factory: Customer', function () {
  beforeEach(module('appliancePointOfSale'));

  beforeEach(inject(function (Customer) {
    this.Customer = Customer;
  }));

  describe('constructor', function () {
    it('should use default values if no rawData is provided', function () {
      const customer = new this.Customer();
      expect(customer.rawData).toEqual(this.Customer.defaults);
    });

    it('should override defaults with provided rawData', function () {
      const customer = new this.Customer({ firstName: 'George', lastName: 'Washington' });
      expect(customer.lastName).toBe('Washington');
    });

    it('should initialize tickets to an empty array', function () {
      const customer = new this.Customer();
      expect(customer.tickets).toEqual(jasmine.any(Array));
      expect(customer.tickets.length).toBe(0);
    });
  });

  describe('addTicket', function () {
    it('should add a ticket to the tickets list', function () {
      const dummyTicket = { amountPaid: 125.00 };
      const customer = new this.Customer();

      customer.addTicket(dummyTicket);

      expect(customer.tickets.length).toBe(1);
      expect(customer.tickets[0]).toBe(dummyTicket);
    });
  });

  describe('get id', function () {
    it('should return the customer id', function () {
      const customer = new this.Customer();
      _.set(customer.rawData, '_links.self.href', '/ShoreTVCustomers/ServiceTickets/customers/123');
      expect(customer.id).toBe('123');
    });

    it('should return undefined if the self link does not exist', function () {
      const customer = new this.Customer();
      expect(customer.id).toBeUndefined();
    });
  });

  describe('selfHref', function () {
    it('should return the self href', function () {
      const customer = new this.Customer();
      _.set(customer.rawData, '_links.self.href', '/ShoreTVCustomers/ServiceTickets/customers/123');
      expect(customer.selfHref).toBe('/ShoreTVCustomers/ServiceTickets/customers/123');
    });

    it('should return undefined if the self link does not exist', function () {
      const customer = new this.Customer();
      expect(customer.selfHref).toBeUndefined();
    });
  });

  describe('ticketsHref', function () {
    it('should return the tickets href', function () {
      const customer = new this.Customer();
      _.set(customer.rawData, '_links.tickets.href', '/ShoreTVCustomers/ServiceTickets/customerTickets/123');
      expect(customer.ticketsHref).toBe('/ShoreTVCustomers/ServiceTickets/customerTickets/123');
    });

    it('should return undefined if the tickets link does not exist', function () {
      const customer = new this.Customer();
      expect(customer.ticketsHref).toBeUndefined();
    });
  });

  describe('get/set address', function () {
    it('should update the address correctly', function () {
      const customer = new this.Customer();
      customer.address = '11 E. Main St.';
      expect(customer.address).toBe('11 E. Main St.');
    });
  });

  describe('get/set city', function () {
    it('should update the city correctly', function () {
      const customer = new this.Customer();
      customer.city = 'Clinton';
      expect(customer.city).toBe('Clinton');
    });
  });

  describe('get/set firstName', function () {
    it('should update the first name correctly', function () {
      const customer = new this.Customer();
      customer.firstName = 'Abraham';
      expect(customer.firstName).toBe('Abraham');
    });
  });

  describe('get/set lastName', function () {
    it('should update the last name correctly', function () {
      const customer = new this.Customer();
      customer.lastName = 'Lincoln';
      expect(customer.lastName).toBe('Lincoln');
    });
  });

  describe('get/set phoneNumber', function () {
    it('should update the phone number correctly', function () {
      const customer = new this.Customer();
      customer.phoneNumber = '6698007';
      expect(customer.phoneNumber).toBe('6698007');
    });
  });

  describe('get/set state', function () {
    it('should update the state correctly', function () {
      const customer = new this.Customer();
      customer.state = 'CT';
      expect(customer.state).toBe('CT');
    });
  });

  describe('get/set workNumber', function () {
    it('should update the work number correctly', function () {
      const customer = new this.Customer();
      customer.workNumber = 'c# 555-5555';
      expect(customer.workNumber).toBe('c# 555-5555');
    });
  });

  describe('get/set zip', function () {
    it('should update the zip correctly', function () {
      const customer = new this.Customer();
      customer.zip = '06413';
      expect(customer.zip).toBe('06413');
    });
  });
});
