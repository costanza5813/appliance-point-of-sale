'use strict';

describe('Service: typeaheadOptions', function () {
  beforeEach(module('appliancePointOfSale'));

  beforeEach(inject(function ($httpBackend, $injector) {
    this.$httpBackend = $httpBackend;

    this.whenBrandsGET = $httpBackend.whenGET('data/brands.json');
    this.whenBrandsGET.respond(['Amana', 'GE', 'Maytag', 'Whirlpool']);

    this.whenDescriptionsGET = $httpBackend.whenGET('data/descriptions.json');
    this.whenDescriptionsGET.respond(['Microwave', 'Range', 'Refrigerator', 'Washer']);

    this.whenSalespeopleGET = $httpBackend.whenGET('data/salespeople.json');
    this.whenSalespeopleGET.respond(['Fred', 'Gerry', 'Josh', 'Kelly']);

    this.whenTechsGET = $httpBackend.whenGET('data/techs.json');
    this.whenTechsGET.respond(['Kevin', 'Mikey', 'Rob']);

    this.injectService = () => {
      return $injector.get('typeaheadOptions');
    };
  }));

  describe('constructor', function () {
    it('should fetch and cache the brands, descriptions, salespeople, and techs', function () {
      const svc = this.injectService();
      this.$httpBackend.flush();

      expect(svc._brands).toEqual(jasmine.any(Array));
      expect(svc._brands.length).toBe(4);

      expect(svc._descriptions).toEqual(jasmine.any(Array));
      expect(svc._descriptions.length).toBe(4);

      expect(svc._salespeople).toEqual(jasmine.any(Array));
      expect(svc._salespeople.length).toBe(4);

      expect(svc._techs).toEqual(jasmine.any(Array));
      expect(svc._techs.length).toBe(3);
    });
  });

  describe('get brands', function () {
    it('should return a promise which resolves to the cached brands', function (done) {
      const svc = this.injectService();

      svc.brands.then((brands) => {
        expect(brands).toEqual(jasmine.any(Array));
        expect(brands.length).toBe(4);
        done();
      });

      this.$httpBackend.flush();
    });

    it('should return a promise that resolves to an empty array if _brands is not defined', function (done) {
      this.whenBrandsGET.respond();
      const svc = this.injectService();

      svc.brands.then((brands) => {
        expect(brands).toEqual([]);
        done();
      });

      this.$httpBackend.flush();
    });
  });

  describe('get descriptions', function () {
    it('should return a promise which resolves to the cached descriptions', function (done) {
      const svc = this.injectService();

      svc.descriptions.then((descriptions) => {
        expect(descriptions).toEqual(jasmine.any(Array));
        expect(descriptions.length).toBe(4);
        done();
      });

      this.$httpBackend.flush();
    });

    it('should return a promise that resolves to an empty array if _descriptions is not defined', function (done) {
      this.whenDescriptionsGET.respond();
      const svc = this.injectService();

      svc.descriptions.then((descriptions) => {
        expect(descriptions).toEqual([]);
        done();
      });

      this.$httpBackend.flush();
    });
  });

  describe('get salespeople', function () {
    it('should return a promise which resolves to the cached salespeople', function (done) {
      const svc = this.injectService();

      svc.salespeople.then((salespeople) => {
        expect(salespeople).toEqual(jasmine.any(Array));
        expect(salespeople.length).toBe(4);
        done();
      });

      this.$httpBackend.flush();
    });

    it('should return a promise that resolves to an empty array if _salespeople is not defined', function (done) {
      this.whenSalespeopleGET.respond();
      const svc = this.injectService();

      svc.salespeople.then((salespeople) => {
        expect(salespeople).toEqual([]);
        done();
      });

      this.$httpBackend.flush();
    });
  });

  describe('get techs', function () {
    it('should return a promise which resolves to the cached techs', function (done) {
      const svc = this.injectService();

      svc.techs.then((techs) => {
        expect(techs).toEqual(jasmine.any(Array));
        expect(techs.length).toBe(3);
        done();
      });

      this.$httpBackend.flush();
    });

    it('should return a promise that resolves to an empty array if _techs is not defined', function (done) {
      this.whenTechsGET.respond();
      const svc = this.injectService();

      svc.techs.then((techs) => {
        expect(techs).toEqual([]);
        done();
      });

      this.$httpBackend.flush();
    });
  });
});
