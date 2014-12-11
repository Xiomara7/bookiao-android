angular.module('starter.services', [])


.factory('Business', function($http) {

  return {
    all: function() {
      return $http.get('http://bookiao-api.herokuapp.com/businesses/');
    },

    create: function(user) {
      return $http.post('http://bookiao-api.herokuapp.com/businesses/', user, {headers: {'Authorization': 'JWT ' + window.localStorage['token']}});
    }
  }
})

.factory('Client', function($http) {

  return {
    all: function() {
      return $http.get('http://bookiao-api.herokuapp.com/clients/');
    },

    update: function(newClientData) {
      return $http.put('http://bookiao-api.herokuapp.com/clients/' + newClientData.id + '/', newClientData, {headers: {'Authorization': 'JWT ' + window.localStorage['token']}});
    },

    create: function(user) {
      return $http.post('http://bookiao-api.herokuapp.com/clients/', user, {headers: {'Authorization': 'JWT ' + window.localStorage['token']}});
    }
  }
})

.factory('Employee', function($http) {

  return {
    all: function() {
      return $http.get('http://bookiao-api.herokuapp.com/employees/');
    },

    update: function(newEmployeeData) {
      return $http.put('http://bookiao-api.herokuapp.com/employees/' + newEmployeeData.id + '/', newEmployeeData, {headers: {'Authorization': 'JWT ' + window.localStorage['token']}});
    },

    create: function(user) {
      return $http.post('http://bookiao-api.herokuapp.com/employees/', user, {headers: {'Authorization': 'JWT ' + window.localStorage['token']}});
    }
  }
})

.factory('Service', function($http) {

  return {
    all: function() {
      return $http.get('http://bookiao-api.herokuapp.com/services/');
    }
  }

})

.factory('Appointment', function($http) {

  return {
    all: function() {
      return $http.get('http://bookiao-api.herokuapp.com/appointments/')
    },

    create: function(appointment) {
      return $http.post('https://bookiao-api.herokuapp.com/appointments/', appointment, {headers: {'Authorization': 'JWT ' + window.localStorage['token']}})
    },

    filter: function(params) {
      return $http.get('http://bookiao-api.herokuapp.com/appointments/', {
        params: params
      });
    }
  }

})

.factory('Helpers', function($http) {

  return {
    getToken: function(email, password) {
      return $http.post('http://bookiao-api.herokuapp.com/api-token-auth/', {"email": email, "password": password});
    },

    getUserType: function(email) {
      return $http.get('http://bookiao-api.herokuapp.com/user-type/?email=' + email);
    },

    registerUser: function(user) {
      return $http.post('http://bookiao-api.herokuapp.com/register/', user);
    }
  }

});
