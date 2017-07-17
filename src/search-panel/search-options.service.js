'use strict';
'ngInject';

const dateFormat = 'YYYY-MM-DD';

class SearchOptions {

  static get defaults() {
    return {
      searchText: '',
      searchType: 'lastName',
      resultType: 'both',
      startDate: moment().subtract(90, 'days').format(dateFormat),
      endDate: moment().format(dateFormat),
    };
  }

  constructor(rawData, onUpdateCallback) {
    this._rawData = _.assign(SearchOptions.defaults, rawData);
    this._onUpdateCallback = onUpdateCallback;
  }

  get rawData() {
    return this._rawData;
  }

  get searchText() {
    return this._rawData.searchText;
  }

  set searchText(searchText) {
    this._rawData.searchText = searchText;

    if (_.isFunction(this._onUpdateCallback)) {
      this._onUpdateCallback();
    }
  }

  get searchType() {
    return this._rawData.searchType;
  }

  set searchType(searchType) {
    if (searchType !== this._rawData.searchType) {
      this._rawData.searchType = searchType;
      this._rawData.searchText = '';

      if (_.isFunction(this._onUpdateCallback)) {
        this._onUpdateCallback();
      }
    }
  }

  get resultType() {
    return this._rawData.resultType;
  }

  set resultType(resultType) {
    if (resultType !== this._rawData.resultType) {
      this._rawData.resultType = resultType;

      if (_.isFunction(this._onUpdateCallback)) {
        this._onUpdateCallback();
      }
    }
  }

  get startDate() {
    return this._rawData.startDate;
  }

  set startDate(startDate) {
    this._rawData.startDate = startDate;

    if (_.isFunction(this._onUpdateCallback)) {
      this._onUpdateCallback();
    }
  }

  get endDate() {
    return this._rawData.endDate;
  }

  set endDate(endDate) {
    this._rawData.endDate = endDate;

    if (_.isFunction(this._onUpdateCallback)) {
      this._onUpdateCallback();
    }
  }
}
angular.module('appliancePointOfSale').factory('SearchOptions', () => SearchOptions);
