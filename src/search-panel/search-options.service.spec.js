'use strict';

describe('Factory: SearchOptions', function () {
  beforeEach(module('appliancePointOfSale'));

  beforeEach(inject(function (SearchOptions) {
    this.SearchOptions = SearchOptions;
  }));

  describe('constructor', function () {
    it('should use default values if no rawData is provided', function () {
      const searchOptions = new this.SearchOptions();
      expect(searchOptions.rawData).toEqual(this.SearchOptions.defaults);
    });

    it('should override defaults with provided rawData', function () {
      const searchOptions = new this.SearchOptions({ searchType: 'phoneNumber' });
      expect(searchOptions.searchType).toBe('phoneNumber');
    });

    it('should set the _onUpdateCallback function if provided', function () {
      const onUpdateCallback = () => 'onUpdateCallback';
      const searchOptions = new this.SearchOptions({}, onUpdateCallback);
      expect(searchOptions._onUpdateCallback).toBe(onUpdateCallback);
    });
  });

  describe('get/set searchText', function () {
    it('should update searchText correctly', function () {
      const searchOptions = new this.SearchOptions();
      searchOptions.searchText = 'Johnson';
      expect(searchOptions.searchText).toBe('Johnson');
    });

    it('should call _onUpdateCallback on update', function () {
      const onUpdateCallback = () => 'onUpdateCallback';
      const searchOptions = new this.SearchOptions({}, onUpdateCallback);
      spyOn(searchOptions, '_onUpdateCallback');
      searchOptions.searchText = 'Johnson';
      expect(searchOptions._onUpdateCallback).toHaveBeenCalled();
    });
  });

  describe('get/set searchType', function () {
    it('should update searchType correctly', function () {
      const searchOptions = new this.SearchOptions();
      searchOptions.searchType = 'phoneNumber';
      expect(searchOptions.searchType).toBe('phoneNumber');
    });

    it('should call _onUpdateCallback on update', function () {
      const onUpdateCallback = () => 'onUpdateCallback';
      const searchOptions = new this.SearchOptions({}, onUpdateCallback);
      spyOn(searchOptions, '_onUpdateCallback');
      searchOptions.searchType = 'phoneNumber';
      expect(searchOptions._onUpdateCallback).toHaveBeenCalled();
    });

    it('should not call _onUpdateCallback if value is the same', function () {
      const onUpdateCallback = () => 'onUpdateCallback';
      const searchOptions = new this.SearchOptions({}, onUpdateCallback);
      spyOn(searchOptions, '_onUpdateCallback');
      searchOptions.searchType = 'lastName';
      expect(searchOptions._onUpdateCallback).not.toHaveBeenCalled();
    });
  });

  describe('get/set resultType', function () {
    it('should update resultType correctly', function () {
      const searchOptions = new this.SearchOptions();
      searchOptions.resultType = 'ticketsOnly';
      expect(searchOptions.resultType).toBe('ticketsOnly');
    });

    it('should call _onUpdateCallback on update', function () {
      const onUpdateCallback = () => 'onUpdateCallback';
      const searchOptions = new this.SearchOptions({}, onUpdateCallback);
      spyOn(searchOptions, '_onUpdateCallback');
      searchOptions.resultType = 'ticketsOnly';
      expect(searchOptions._onUpdateCallback).toHaveBeenCalled();
    });

    it('should not call _onUpdateCallback if value is the same', function () {
      const onUpdateCallback = () => 'onUpdateCallback';
      const searchOptions = new this.SearchOptions({}, onUpdateCallback);
      spyOn(searchOptions, '_onUpdateCallback');
      searchOptions.resultType = 'both';
      expect(searchOptions._onUpdateCallback).not.toHaveBeenCalled();
    });
  });

  describe('get/set startDate', function () {
    it('should update startDate correctly', function () {
      const searchOptions = new this.SearchOptions();
      searchOptions.startDate = '1990-03-19';
      expect(searchOptions.startDate).toBe('1990-03-19');
    });

    it('should call _onUpdateCallback on update', function () {
      const onUpdateCallback = () => 'onUpdateCallback';
      const searchOptions = new this.SearchOptions({}, onUpdateCallback);
      spyOn(searchOptions, '_onUpdateCallback');
      searchOptions.startDate = '1990-03-19';
      expect(searchOptions._onUpdateCallback).toHaveBeenCalled();
    });
  });

  describe('get/set endDate', function () {
    it('should update endDate correctly', function () {
      const searchOptions = new this.SearchOptions();
      searchOptions.endDate = '2017-07-16';
      expect(searchOptions.endDate).toBe('2017-07-16');
    });

    it('should call _onUpdateCallback on update', function () {
      const onUpdateCallback = () => 'onUpdateCallback';
      const searchOptions = new this.SearchOptions({}, onUpdateCallback);
      spyOn(searchOptions, '_onUpdateCallback');
      searchOptions.endDate = '2017-07-16';
      expect(searchOptions._onUpdateCallback).toHaveBeenCalled();
    });
  });
});
