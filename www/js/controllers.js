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
})

.controller('TabCtrl', function($scope, $ionicModal, $location) {

  var init = function() {
    if (window.localStorage['token'] === undefined) {
      $location.path("/login");
    }
  }
  // init();
})

.controller('DashCtrl', function($scope, $ionicModal) {
  $ionicModal.fromTemplateUrl('create-booking.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
    console.log('hello');
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
  init();
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
});
