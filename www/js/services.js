angular.module('starter.services', [])


.factory('Business', function($http) {

  return {
    all: function() {
      return $http.get('http://bookiao-api.herokuapp.com/businesses/');
    }
  }
})

.factory('Client', function($http) {

  return {
    all: function() {
      return $http.get('http://bookiao-api.herokuapp.com/clients/');
    }
  }
})

.factory('Employee', function($http) {

  return {
    all: function() {
      return $http.get('http://bookiao-api.herokuapp.com/employees/');
    }
  }
});
