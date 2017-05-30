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
        customer: function($q, $transition$, customerResource, ticketResource) {
          const customerId = $transition$.params().customerId;

          let customerPromise;
          if (customerId) {
            customerPromise = customerResource.fetchCustomer(customerId);
          } else {
            customerPromise = customerResource.createCustomer();
          }

          return customerPromise.then((customer) => {
            return ticketResource.fetchTicketsForCustomer(customer).then((tickets) => {
              if (_.isEmpty(tickets)) {
                return ticketResource.createTicketForCustomer(customer).then((ticket) => {
                  customer.addTicket(ticket);
                  return customer;
                });
              }

              _.each(tickets, (ticket) => { customer.addTicket(ticket); });
              return customer;
            });
          }, () => $q.reject({ description: 'Customer not found.'}));
        }
      }
    },

    {
      name: 'tickets',
      url: '/tickets/{ticketId}',
      component: 'ticketPanel',
      resolve: {
        customer: function($q, $transition$, Customer, customerResource, ticketResource) {
          const ticketId = $transition$.params().ticketId;

          if(!ticketId) {
            return $q.reject({ description: 'Ticket number not provided.' });
          }

          return ticketResource.fetchTicket(ticketId).then((ticket) => {
            return customerResource.fetchCustomerForTicket(ticket).then((customer) => {
              customer.addTicket(ticket);
              return customer;
            });
          }, () => $q.reject({ description: 'Ticket \'' + ticketId + '\' not found.' }));
        }
      }
    },

    {
      name: 'error',
      url: '/error',
      component: 'error',
      params: {
        description: ''
      },
      resolve: {
        error: ($transition$) => {
          return { code: 404, description: $transition$.params().description || 'Customer or ticket not found.'};
        }
      }
    },
  ];

  // Loop over the state definitions and register them
  _.each(states, (state) => {
    $stateProvider.state(state);
  });
}).run(function($rootScope, $state, $transitions, $uibModal, $window, currentSelections, spinnerHandler) {
  $transitions.onError({}, (transition) => {
    $state.go('error', transition.error());
  });

  const modalOptions = {
    backdrop: 'static',
    keyboard: false,
    component: 'confirmUnsavedChanges',
  };

  $transitions.onStart({
    from: (state) => _.includes(['customers', 'tickets'], state.name) && currentSelections.hasUnsavedChanges()
  }, () => {
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
