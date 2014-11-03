angular.module('starter.controllers', ['ionic'])

.controller('LoginCtrl', function($scope) {
})

.controller('TabCtrl', function($scope, $ionicModal) {
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
