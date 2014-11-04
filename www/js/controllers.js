angular.module('starter.controllers', ['ionic'])

.controller('LoginCtrl', function($scope, $http, $location) {

  // Function that handles login
  $scope.login = function() {
    $http.post('http://bookiao-api.herokuapp.com/api-token-auth/', {"email": $scope.email, "password": $scope.password}).
      success(function(data, status, headers, config) {
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

.controller('RegisterCtrl', function($scope, $location, $http) {
  $scope.back = function() {
    $location.path("/login");
  };

  $scope.login = function() {
    $http.post('http://bookiao-api.herokuapp.com/api-token-auth/', {"email": $scope.user.email, "password": $scope.user.password}).
      success(function(data, status, headers, config) {
        if (status == 200) {
          window.localStorage['token'] = data.token;
          $scope.createObject();
        };
      }).
      error(function(data, status, headers, config) {
        alert("Error during login. Please contact Christian.");
      });
  };

  $scope.createUser = function() {
    $scope.user = JSON.parse(window.localStorage['user']);
    $http.post('http://bookiao-api.herokuapp.com/register/', $scope.user).
      success($scope.login).
      error(function(data, status, headers, config) {
        alert('Error creating user. Please contact Christian.');
      });
  }

  $scope.createObject = function() {
    $http.post($scope.user.objectUrl, $scope.user, {headers: {'Authorization': 'JWT ' + window.localStorage['token']}}).
      success(function(data, status, headers, config) {
        $location.path("/tab/dash");
      }).
      error(function(data, status, headers, config) {
        alert('Error creating object. Please contact Christian.');
      });
  }

})

.controller('RegisterBusinessCtrl', function($scope, $location) {

  $scope.user = { 'objectUrl': 'http://bookiao-api.herokuapp.com/businesses/'};

  $scope.register = function() {
    delete window.localStorage['user'];
    window.localStorage['user'] = JSON.stringify($scope.user);

    $scope.createUser();
  }

})

.controller('RegisterEmployeeCtrl', function($scope, $location) {

})

.controller('RegisterClientCtrl', function($scope, $location) {

});


