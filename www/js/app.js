// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html",
      controller: 'TabCtrl'
    })

    // Each tab has its own nav history stack:

    .state('tab.citas', {
      url: '/citas',
      views: {
        'tab-citas': {
          templateUrl: 'templates/tab-citas.html',
          controller: 'CitasCtrl'
        }
      }
    })

    .state('tab.history', {
      url: '/history',
      views: {
        'tab-history': {
          templateUrl: 'templates/tab-history.html',
          controller: 'HistoryCtrl'
        }
      }
    })

    .state('tab.account', {
      url: '/account',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-account.html',
          controller: 'AccountCtrl'
        }
      }
    })

    .state('register', {
      url: '/register',
      abstract: true,
      templateUrl: 'templates/register.html',
      controller: 'RegisterCtrl'
    })

    .state('register.business', {
      url: '/business',
      views: {
        'register-business': {
          templateUrl: 'templates/register-business.html',
          controller: 'RegisterBusinessCtrl'
        }
      }
    })

    .state('register.employee', {
      url: '/employee',
      views: {
        'register-employee': {
          templateUrl: 'templates/register-employee.html',
          controller: 'RegisterEmployeeCtrl'
        }
      }
    })

    .state('register.client', {
      url: '/client',
      views: {
        'register-client': {
          templateUrl: 'templates/register-client.html',
          controller: 'RegisterClientCtrl'
        }
      }
    })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});

