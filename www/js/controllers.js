angular.module('starter.controllers', ['ionic'])

.controller('LoginCtrl', function($scope, $http, $location) {

  // Function that handles login
  $scope.login = function() {
    $http.post('http://bookiao-api.herokuapp.com/api-token-auth/', {"email": $scope.email, "password": $scope.password}).
      success(function(data, status, headers, config) {
        // On success save the token and redirect to home page
        if (status == 200) {
          window.localStorage['token'] = data.token;
          $location.path("/tab/dash");
        };
      }).
      error(function(data, status, headers, config) {
        alert("Error during login.");
      });
  }

  // Function that redirects to register
  $scope.register = function() {
    $location.path("/register/business");
  }
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

.controller('DashCtrl', function($scope, $ionicModal) {
})

.controller('FriendsCtrl', function($scope, Friends) {
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
// logic.
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
        $location.path("/tab/dash");
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

})

// Controller for registering Clients
.controller('RegisterClientCtrl', function($scope, $location) {
  $scope.user.objectUrl = 'http://bookiao-api.herokuapp.com/clients/';
});


