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
      name: 'error',
      url: '/error',
      component: 'error',
      resolve: {
        error: () => {
          return { code: 404, description: 'Customer not found.'};
        }
      }
    },
  ];

  // Loop over the state definitions and register them
  _.each(states, (state) => {
    $stateProvider.state(state);
  });
}).run(function($rootScope, $state, $transitions, $uibModal, $window, currentSelections, spinnerHandler) {
  $transitions.onError({}, () => {
    $state.go('error');
  });

  const modalOptions = {
    backdrop: 'static',
    keyboard: false,
    component: 'confirmUnsavedChanges',
  };

  $transitions.onStart({ from: (state) => state.name === 'customers' && currentSelections.hasUnsavedChanges() }, () => {
    return $uibModal.open(modalOptions).result.then(() => {
      spinnerHandler.show = true;
      return currentSelections.save().finally(() => { spinnerHandler.show = false; });
    }, () => true);
  });

  $window.onbeforeunload = () => {
    if ($state.current.name === 'customers' && currentSelections.hasUnsavedChanges()) {
      return 'unsaved changes';
    }
  };
});
