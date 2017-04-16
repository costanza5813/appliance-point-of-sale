'use strict';
'ngInject';

angular.module('appliancePointOfSale', [
  'ngSanitize',
  'angularSpinner',
  'ui.bootstrap',
  'ui.router',
  'ui.bootstrap.datetimepicker',
  'snap',
]).config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/welcome');

  // const customer = {
  //   name: 'customer',
  //   url: '/customer',
  //   component: 'welcome',
  // };

  // An array of state definitions
  const states = [
    {
      name: 'welcome',
      url: '/welcome',
      component: 'welcome',
    },

    {
      name: 'customers',
      url: '/customers/{customerId}',
      component: 'ticketPanel',
      resolve: {
        customer: function($transition$, Customer, customerResource) {
          const customerId = $transition$.params().customerId;

          let customerPromise;
          if (customerId) {
            customerPromise = customerResource.fetchCustomer(customerId);
          } else {
            customerPromise = customerResource.createCustomer();
          }

          return customerPromise.then((rawCustomer) => new Customer(rawCustomer));
        }
      }
    },

    {
      name: 'print',
      url: '/print',
      parent: 'customers',
      component: 'printPanel',
    },
  ];

  // Loop over the state definitions and register them
  _.each(states, (state) => {
    $stateProvider.state(state);
  });
}).run(function($rootScope, $state) {
  $rootScope.$on('$stateChangeError', function() {
    $state.go('welcome', {});
  });
});
