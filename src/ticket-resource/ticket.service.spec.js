'use strict';

describe('Factory: Ticket', function () {
  beforeEach(module('appliancePointOfSale'));

  beforeEach(inject(function (Ticket, Part, Payment, Service) {
    this.Ticket = Ticket;
    this.Part = Part;
    this.Payment = Payment;
    this.Service = Service;
  }));

  describe('_updateTotals', function () {
    beforeEach(function () {
      this.ticket = new this.Ticket();
      this.ticket.addPart(new this.Part({ price: 1, quantity: 1 }, this.ticket.updateTotals.bind(this.ticket)));
      this.ticket.addPart(new this.Part({ price: 2, quantity: 1 }, this.ticket.updateTotals.bind(this.ticket)));
      this.ticket.addPayment(new this.Payment({ paymentAmount: 1.06 }, this.ticket.updateTotals.bind(this.ticket)));
      this.ticket.addPayment(new this.Payment({ paymentAmount: 2.13 }, this.ticket.updateTotals.bind(this.ticket)));
    });

    it('should update all the totals from the added parts and payments', function () {
      expect(this.ticket.amountPaid).toBeCloseTo(3.19, 2);
      expect(this.ticket.balanceDue).toBeCloseTo(0, 2);
      expect(this.ticket.subtotal).toBeCloseTo(3, 2);
      expect(this.ticket.tax).toBeCloseTo(0.19, 2);
      expect(this.ticket.total).toBeCloseTo(3.19, 2);
    });

    it('should ignore deleted components', function () {
      this.ticket.parts[1].deleted = true;
      this.ticket.payments[1].deleted = true;

      expect(this.ticket.amountPaid).toBeCloseTo(1.06, 2);
      expect(this.ticket.balanceDue).toBeCloseTo(0, 2);
      expect(this.ticket.subtotal).toBeCloseTo(1, 2);
      expect(this.ticket.tax).toBeCloseTo(0.06, 2);
      expect(this.ticket.total).toBeCloseTo(1.06, 2);
    });

    it('should not have an amountPaid or balanceDue if a warranty payment exists', function () {
      this.ticket.payments[1].paymentType = this.Payment.ePaymentTypes.warranty.value;

      expect(this.ticket.amountPaid).toBe(0);
      expect(this.ticket.balanceDue).toBe(0);
      expect(this.ticket.subtotal).toBeCloseTo(3, 2);
      expect(this.ticket.tax).toBeCloseTo(0.19, 2);
      expect(this.ticket.total).toBeCloseTo(3.19, 2);
    });

    it('should not have any tax if the ticket is not taxable', function () {
      this.ticket.taxable = false;

      expect(this.ticket.amountPaid).toBeCloseTo(3.19, 2);
      expect(this.ticket.balanceDue).toBeCloseTo(-0.19, 2);
      expect(this.ticket.subtotal).toBeCloseTo(3, 2);
      expect(this.ticket.tax).toBe(0);
      expect(this.ticket.total).toBeCloseTo(3, 2);
    });
  });

  describe('constructor', function () {
    it('should use default values if no rawData is provided', function () {
      const ticket = new this.Ticket();
      expect(ticket.rawData).toEqual(this.Ticket.defaults);
    });

    it('should override defaults with provided rawData', function () {
      const ticket = new this.Ticket({ brand: 'GE' });
      expect(ticket.brand).toBe('GE');
    });

    it('should initialize the parts, payments and services arrays', function () {
      const ticket = new this.Ticket({ brand: 'GE' });
      expect(ticket.parts).toEqual(jasmine.any(Array));
      expect(ticket.payments).toEqual(jasmine.any(Array));
      expect(ticket.services).toEqual(jasmine.any(Array));
    });

    it('should call _updateTotal on construction', function () {
      const part = new this.Part({ price: 1, quantity: 2 });
      expect(part.total).toBeCloseTo(2, 2);
    });
  });

  describe('addPart', function () {
    it('should add the part to the ticket', function () {
      const ticket = new this.Ticket();
      const part = new this.Part();

      ticket.addPart(part);

      expect(ticket.parts.length).toBe(1);
      expect(ticket.parts[0]).toBe(part);
    });

    it('should call _updateTotals when a new part is added', function () {
      const ticket = new this.Ticket();
      const part = new this.Part();

      spyOn(ticket, '_updateTotals');
      ticket.addPart(part);

      expect(ticket._updateTotals).toHaveBeenCalled();
    });
  });

  describe('addPayment', function () {
    it('should add the payment to the ticket', function () {
      const ticket = new this.Ticket();
      const payment = new this.Payment();

      ticket.addPayment(payment);

      expect(ticket.payments.length).toBe(1);
      expect(ticket.payments[0]).toBe(payment);
    });

    it('should call _updateTotals when a new payment is added', function () {
      const ticket = new this.Ticket();
      const payment = new this.Payment();

      spyOn(ticket, '_updateTotals');
      ticket.addPayment(payment);

      expect(ticket._updateTotals).toHaveBeenCalled();
    });
  });

  describe('addService', function () {
    it('should add the service to the ticket', function () {
      const ticket = new this.Ticket();
      const service = new this.Service();

      ticket.addService(service);

      expect(ticket.services.length).toBe(1);
      expect(ticket.services[0]).toBe(service);
    });
  });

  describe('get id', function () {
    it('should return the ticket id', function () {
      const ticket = new this.Ticket();
      _.set(ticket.rawData, '_links.self.href', '/ShoreTVCustomers/ServiceTickets/tickets/123');
      expect(ticket.id).toBe('123');
    });

    it('should return idtickets if self link does not exist', function () {
      const ticket = new this.Ticket();
      ticket.rawData.idtickets = '123';
      expect(ticket.id).toBe('123');
    });

    it('should return an empty string if the self link and idtickets does not exist', function () {
      const ticket = new this.Ticket();
      expect(ticket.id).toBe('');
    });
  });

  describe('selfHref', function () {
    it('should return the self href', function () {
      const ticket = new this.Ticket();
      _.set(ticket.rawData, '_links.self.href', '/ShoreTVCustomers/ServiceTickets/tickets/123');
      expect(ticket.selfHref).toBe('/ShoreTVCustomers/ServiceTickets/tickets/123');
    });

    it('should create the href using idtickets if the regular href does not exist', function () {
      const ticket = new this.Ticket();
      ticket.rawData.idtickets = '123';
      expect(ticket.selfHref).toBe('/ShoreTVCustomers/ServiceTickets/tickets/123');
    });
  });

  describe('partsHref', function () {
    it('should return the parts href', function () {
      const ticket = new this.Ticket();
      _.set(ticket.rawData, '_links.quotes.href', '/ShoreTVCustomers/ServiceTickets/tickets/123/quotes');
      expect(ticket.partsHref).toBe('/ShoreTVCustomers/ServiceTickets/tickets/123/quotes');
    });

    it('should create the href using idtickets if the regular href does not exist', function () {
      const ticket = new this.Ticket();
      ticket.rawData.idtickets = '123';
      expect(ticket.partsHref).toBe('/ShoreTVCustomers/ServiceTickets/tickets/123/quotes');
    });
  });

  describe('paymentsHref', function () {
    it('should return the payments href', function () {
      const ticket = new this.Ticket();
      _.set(ticket.rawData, '_links.payments.href', '/ShoreTVCustomers/ServiceTickets/tickets/123/payments');
      expect(ticket.paymentsHref).toBe('/ShoreTVCustomers/ServiceTickets/tickets/123/payments');
    });

    it('should create the href using idtickets if the regular href does not exist', function () {
      const ticket = new this.Ticket();
      ticket.rawData.idtickets = '123';
      expect(ticket.paymentsHref).toBe('/ShoreTVCustomers/ServiceTickets/tickets/123/payments');
    });
  });

  describe('servicesHref', function () {
    it('should return the services href', function () {
      const ticket = new this.Ticket();
      _.set(ticket.rawData, '_links.serviceCalls.href', '/ShoreTVCustomers/ServiceTickets/tickets/123/serviceCalls');
      expect(ticket.servicesHref).toBe('/ShoreTVCustomers/ServiceTickets/tickets/123/serviceCalls');
    });

    it('should create the href using idtickets if the regular href does not exist', function () {
      const ticket = new this.Ticket();
      ticket.rawData.idtickets = '123';
      expect(ticket.servicesHref).toBe('/ShoreTVCustomers/ServiceTickets/tickets/123/serviceCalls');
    });
  });

  describe('customerHref', function () {
    it('should return the customer href', function () {
      const ticket = new this.Ticket();
      _.set(ticket.rawData, '_links.customer.href', '/ShoreTVCustomers/ServiceTickets/ticketsCustomer/123/customer');
      expect(ticket.customerHref).toBe('/ShoreTVCustomers/ServiceTickets/ticketsCustomer/123/customer');
    });

    it('should create the href using idtickets if the regular href does not exist', function () {
      const ticket = new this.Ticket();
      ticket.rawData.idtickets = '123';
      expect(ticket.customerHref).toBe('/ShoreTVCustomers/ServiceTickets/ticketsCustomer/123/customer');
    });
  });

  describe('get/set customerComplaint', function () {
    it('should update the customer complaint correctly', function () {
      const ticket = new this.Ticket();
      ticket.customerComplaint = 'This is a complaint.';
      expect(ticket.customerComplaint).toBe('This is a complaint.');
    });
  });

  describe('get dateOpen', function () {
    it('should update the date open correctly', function () {
      const ticket = new this.Ticket();
      ticket.rawData.dateOpen = '6/15/2017 1:00 am';
      expect(ticket.dateOpen).toBe('6/15/2017 1:00 am');
    });
  });

  describe('get/set item', function () {
    it('should update the item correctly', function () {
      const ticket = new this.Ticket();
      ticket.item = 'Refrigerator';
      expect(ticket.item).toBe('Refrigerator');
    });
  });

  describe('get/set model', function () {
    it('should update the model correctly', function () {
      const ticket = new this.Ticket();
      ticket.model = '123abc';
      expect(ticket.model).toBe('123abc');
    });
  });

  describe('get/set serialNumber', function () {
    it('should update the serial number correctly', function () {
      const ticket = new this.Ticket();
      ticket.serialNumber = '12345abcdef';
      expect(ticket.serialNumber).toBe('12345abcdef');
    });
  });

  describe('get/set serviceDescription', function () {
    it('should update the service description correctly', function () {
      const ticket = new this.Ticket();
      ticket.serviceDescription = 'This is a service description.';
      expect(ticket.serviceDescription).toBe('This is a service description.');
    });
  });

  describe('get/set store', function () {
    it('should update the store correctly', function () {
      const ticket = new this.Ticket();
      ticket.store = 'Clinton';
      expect(ticket.store).toBe('Clinton');
    });
  });

  describe('get/set taxable', function () {
    it('should update the taxable correctly', function () {
      const ticket = new this.Ticket();
      ticket.taxable = false;
      expect(ticket.taxable).toBe(false);
    });

    it('should call _updateTotals on update', function () {
      const ticket = new this.Ticket();
      spyOn(ticket, '_updateTotals');

      ticket.taxable = false;

      expect(ticket._updateTotals).toHaveBeenCalled();
    });
  });

  describe('get/set tech', function () {
    it('should update the tech correctly', function () {
      const ticket = new this.Ticket();
      ticket.tech = 'Mikey';
      expect(ticket.tech).toBe('Mikey');
    });
  });

  describe('get/set billingName', function () {
    it('should update the billing name correctly', function () {
      const ticket = new this.Ticket();
      ticket.billingName = 'Luke';
      expect(ticket.billingName).toBe('Luke');
    });
  });

  describe('get/set billingLastName', function () {
    it('should update the billing last name correctly', function () {
      const ticket = new this.Ticket();
      ticket.billingLastName = 'Skywalker';
      expect(ticket.billingLastName).toBe('Skywalker');
    });
  });

  describe('get/set billingAddress', function () {
    it('should update the billing address correctly', function () {
      const ticket = new this.Ticket();
      ticket.billingAddress = '11 E. Main St.';
      expect(ticket.billingAddress).toBe('11 E. Main St.');
    });
  });

  describe('get/set billingCity', function () {
    it('should update the billing city correctly', function () {
      const ticket = new this.Ticket();
      ticket.billingCity = 'Clinton';
      expect(ticket.billingCity).toBe('Clinton');
    });
  });

  describe('get/set billingState', function () {
    it('should update the billing state correctly', function () {
      const ticket = new this.Ticket();
      ticket.billingState = 'CT';
      expect(ticket.billingState).toBe('CT');
    });
  });

  describe('get/set billingZip', function () {
    it('should update the billing zip correctly', function () {
      const ticket = new this.Ticket();
      ticket.billingZip = '06413';
      expect(ticket.billingZip).toBe('06413');
    });
  });

  describe('get/set billingPhone1', function () {
    it('should update the billing phone 1 correctly', function () {
      const ticket = new this.Ticket();
      ticket.billingPhone1 = '6698007';
      expect(ticket.billingPhone1).toBe('6698007');
    });
  });

  describe('get/set billingPhone2', function () {
    it('should update the billing phone 2 correctly', function () {
      const ticket = new this.Ticket();
      ticket.billingPhone2 = 'c# 860-555-5555';
      expect(ticket.billingPhone2).toBe('c# 860-555-5555');
    });
  });

  describe('get/set dateOfPurchase', function () {
    it('should update the date of purchase correctly', function () {
      const ticket = new this.Ticket();
      ticket.dateOfPurchase = '6/15/2017 1:18 am';
      expect(ticket.dateOfPurchase).toBe('6/15/2017 1:18 am');
    });
  });
});
