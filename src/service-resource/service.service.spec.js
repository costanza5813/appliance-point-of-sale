'use strict';

describe('Factory: Service', function () {
  beforeEach(module('appliancePointOfSale'));

  beforeEach(inject(function (Service) {
    this.Service = Service;
  }));

  describe('constructor', function () {
    it('should use default values if no rawData is provided', function () {
      const service = new this.Service();
      expect(service.rawData).toEqual(this.Service.defaults);
    });

    it('should override defaults with provided rawData', function () {
      const service = new this.Service({ tech: 'Kevin' });
      expect(service.tech).toBe('Kevin');
    });

    it('should initialize deleted to false', function () {
      const service = new this.Service();
      expect(service.deleted).toBe(false);
    });
  });

  describe('get id', function () {
    it('should return the service id', function () {
      const service = new this.Service();
      _.set(service.rawData, '_links.self.href', '/ShoreTVCustomers/ServiceTickets/serviceCalls/123');
      expect(service.id).toBe('123');
    });

    it('should return undefined if the self link does not exist', function () {
      const service = new this.Service();
      expect(service.id).toBeUndefined();
    });
  });

  describe('selfHref', function () {
    it('should return the self href', function () {
      const service = new this.Service();
      _.set(service.rawData, '_links.self.href', '/ShoreTVCustomers/ServiceTickets/serviceCalls/123');
      expect(service.selfHref).toBe('/ShoreTVCustomers/ServiceTickets/serviceCalls/123');
    });

    it('should return undefined if the self link does not exist', function () {
      const service = new this.Service();
      expect(service.selfHref).toBeUndefined();
    });
  });

  describe('get/set description', function () {
    it('should update the description correctly', function () {
      const service = new this.Service();
      service.description = 'This is a service description.';
      expect(service.description).toBe('This is a service description.');
    });
  });

  describe('get/set serviceDate', function () {
    it('should update the service date correctly', function () {
      const service = new this.Service();
      service.serviceDate = '12/12/2012 12:12 PM';
      expect(service.serviceDate).toBe('12/12/2012 12:12 PM');
    });
  });

  describe('get/set tech', function () {
    it('should update the tech correctly', function () {
      const service = new this.Service();
      service.tech = 'Pete';
      expect(service.tech).toBe('Pete');
    });
  });

  describe('get/set deleted', function () {
    it('should update deleted correctly', function () {
      const service = new this.Service();
      service.deleted = true;
      expect(service.deleted).toBe(true);
    });
  });
});
