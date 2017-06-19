'use strict';

describe('Factory: Part', function () {
  beforeEach(module('appliancePointOfSale'));

  beforeEach(inject(function (Part) {
    this.Part = Part;
  }));

  describe('_updateTotal', function () {
    it('should update the total based on price and quantity', function () {
      const part = new this.Part();
      part.rawData.price = 199.99;
      part.rawData.quantity = 1;
      part._updateTotal();

      expect(part.total).toBe(199.99);

      part.rawData.quantity = 2;
      part._updateTotal();

      expect(part.total).toBe(399.98);
    });

    it('should call _updateTicket if the part is connected with a ticket', function () {
      const updateTicket = jasmine.createSpy();
      const part = new this.Part({}, updateTicket);
      part._updateTotal();
      expect(updateTicket).toHaveBeenCalled();
    });
  });

  describe('constructor', function () {
    it('should use default values if no rawData is provided', function () {
      const part = new this.Part();
      expect(part.rawData).toEqual(this.Part.defaults);
    });

    it('should override defaults with provided rawData', function () {
      const part = new this.Part({ brand: 'Hotpoint', description: 'Range' });
      expect(part.brand).toBe('Hotpoint');
    });

    it('should initialize deleted to false', function () {
      const part = new this.Part();
      expect(part.deleted).toBe(false);
    });

    it('should set the _updateTicket function if provided', function () {
      const updateTicket = () => 'updateTicket';
      const part = new this.Part({}, updateTicket);
      expect(part._updateTicket).toBe(updateTicket);
    });

    it('should call _updateTotal on construction', function () {
      const part = new this.Part({ price: 1, quantity: 2 });
      expect(part.total).toBeCloseTo(2, 2);
    });
  });

  describe('get id', function () {
    it('should return the part id', function () {
      const part = new this.Part();
      _.set(part.rawData, '_links.self.href', '/ShoreTVCustomers/ServiceTickets/quotes/123');
      expect(part.id).toBe('123');
    });

    it('should return undefined if the self link does not exist', function () {
      const part = new this.Part();
      expect(part.id).toBeUndefined();
    });
  });

  describe('selfHref', function () {
    it('should return the self href', function () {
      const part = new this.Part();
      _.set(part.rawData, '_links.self.href', '/ShoreTVCustomers/ServiceTickets/quotes/123');
      expect(part.selfHref).toBe('/ShoreTVCustomers/ServiceTickets/quotes/123');
    });

    it('should return undefined if the self link does not exist', function () {
      const part = new this.Part();
      expect(part.selfHref).toBeUndefined();
    });
  });

  describe('get/set brand', function () {
    it('should update the brand correctly', function () {
      const part = new this.Part();
      part.brand = 'Speed Queen';
      expect(part.brand).toBe('Speed Queen');
    });
  });

  describe('get/set description', function () {
    it('should update the description correctly', function () {
      const part = new this.Part();
      part.description = 'Washer';
      expect(part.description).toBe('Washer');
    });
  });

  describe('get/set partNum', function () {
    it('should update the partNum correctly', function () {
      const part = new this.Part();
      part.partNum = '123abc';
      expect(part.partNum).toBe('123abc');
    });
  });

  describe('get/set price', function () {
    it('should update the price correctly', function () {
      const part = new this.Part();
      part.price = 499.99;
      expect(part.price).toBe(499.99);
    });

    it('should call _updateTotal on update', function () {
      const part = new this.Part();
      spyOn(part, '_updateTotal');
      part.price = 499.99;
      expect(part._updateTotal).toHaveBeenCalled();
    });
  });

  describe('get/set quantity', function () {
    it('should update the quantity correctly', function () {
      const part = new this.Part();
      part.quantity = 3;
      expect(part.quantity).toBe(3);
    });

    it('should call _updateTotal on update', function () {
      const part = new this.Part();
      spyOn(part, '_updateTotal');
      part.quantity = 5;
      expect(part._updateTotal).toHaveBeenCalled();
    });
  });

  describe('get/set deleted', function () {
    it('should update deleted correctly', function () {
      const part = new this.Part();
      part.deleted = true;
      expect(part.deleted).toBe(true);
    });

    it('should call _updateTotal on update', function () {
      const part = new this.Part();
      spyOn(part, '_updateTotal');
      part.deleted = true;
      expect(part._updateTotal).toHaveBeenCalled();
    });
  });
});
