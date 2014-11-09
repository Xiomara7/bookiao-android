angular.module('starter.controllers', ['ionic'])

.controller('LoginCtrl', function($scope, $http, $location) {

  // Function that handles login
  $scope.login = function() {
    $http.post('http://bookiao-api.herokuapp.com/api-token-auth/', {"email": $scope.email, "password": $scope.password}).
      success(function(data, status, headers, config) {
        // On success save the token and redirect to home page
        if (status == 200) {
          window.localStorage['token'] = data.token;
          $location.path("/tab/citas");
        };
      }).
      error(function(data, status, headers, config) {
        alert("Error during login.");
      });
  }

  $scope.findUserType = function() {
    $http.post('http://bookiao-api.herokuapp.com/api-token-auth/usertype/', {"email": $scope.email}).
      success(function(data, status) {
        window.localStorage['userType'] = data.userType;
        $scope.login();
      }).
      error(function(data, status) {
        alert('Error encontrando al usuario.');
      })
  }

  // Function that redirects to register
  $scope.register = function() {
    $location.path("/register/business");
  }

  // If user is logged in redirect to home page
  // TODO: Actually query the API to verify that token is still valid
  var init = function() {
    if (window.localStorage['token'] !== undefined) {
      $location.path("/tab/citas");
    }
  }
  // init();

})

.controller('TabCtrl', function($scope, $ionicModal, $location) {
  $ionicModal.fromTemplateUrl('create-booking.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    console.log('hello');
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  var init = function() {
    if (window.localStorage['token'] === undefined) {
      $location.path("/login");
    }
  }
  // init();
})

.controller('CitasCtrl', function($scope, $ionicModal) {
})

.controller('FriendsCtrl', function($scope) {
  $scope.openModal = function() {
    console.log('hello');
    $scope.modal.show();
  };
})

.controller('AccountCtrl', function($scope) {
  $scope.openModal = function() {
    console.log('hello');
    $scope.modal.show();
  };
})

// Abstract control for registration that handles all of the actual registration
// logic. TODO: All sorts of sanity checks and input validations
.controller('RegisterCtrl', function($scope, $location, $http) {

  // Function to go back to login
  $scope.back = function() {
    $location.path("/login");
  };

  // Function to login after actually creating a user.
  $scope.login = function() {
    $http.post('http://bookiao-api.herokuapp.com/api-token-auth/', {"email": $scope.user.email, "password": $scope.user.password}).
      success(function(data, status, headers, config) {
        // After sucesful login save the token and create the actual object
        // i.e. Business, Employee or Client
        if (status == 200) {
          window.localStorage['token'] = data.token;
          $scope.createObject();
        };
      }).
      error(function(data, status, headers, config) {
        alert("Error during login. Please contact Christian.");
      });
  };

  // Function that creates the user in the db.
  $scope.createUser = function() {
    $http.post('http://bookiao-api.herokuapp.com/register/', $scope.user).
      // On success attempt to login.
      success($scope.login).
      error(function(data, status, headers, config) {
        alert('Error creating user. Please contact Christian.');
      });
  }

  // Function that actually creates the object in the server
  // Note: Login must be succesful for this to work.
  $scope.createObject = function() {
    $http.post($scope.user.objectUrl, $scope.user, {headers: {'Authorization': 'JWT ' + window.localStorage['token']}}).
      // On success redirect to the home page
      success(function(data, status, headers, config) {
        $location.path("/tab/citas");
      }).
      error(function(data, status, headers, config) {
        alert('Error creating object. Please contact Christian.');
      });
  }

  // Empty user object to store the input information
  $scope.user = {};

})

// Controller for registering Businesses
.controller('RegisterBusinessCtrl', function($scope, $location) {
  $scope.user.objectUrl = 'http://bookiao-api.herokuapp.com/businesses/';
  window.localStorage['userType'] = 'business';
})

// Controller for registering Employees
.controller('RegisterEmployeeCtrl', function($scope, $location, Business) {
  $scope.user.objectUrl = 'http://bookiao-api.herokuapp.com/employees/';

  // Populates the business select input
  $scope.businesses = [];
  var handleSuccess = function(data, status) {
    $scope.businesses = data.results;
    console.log($scope.businesses);
  }
  Business.all().success(handleSuccess);

  window.localStorage['userType'] = 'employee';
})

// Controller for registering Clients
.controller('RegisterClientCtrl', function($scope, $location) {
  $scope.user.objectUrl = 'http://bookiao-api.herokuapp.com/clients/';
  window.localStorage['userType'] = 'client';
});


