var baseUrl = 'https://bookiao-api-staging.herokuapp.com/';

angular.module('starter.services', [])


.factory('Business', function($http) {

  return {
    all: function() {
      return $http.get(baseUrl + 'businesses/');
    },

    create: function(user) {
      return $http.post(baseUrl + 'businesses/', user, {headers: {'Authorization': 'JWT ' + window.localStorage['token']}});
    }
  }
})

.factory('Client', function($http) {

  return {
    all: function() {
      return $http.get(baseUrl + 'clients/');
    },

    update: function(newClientData) {
      return $http.put(baseUrl + 'clients/' + newClientData.id + '/', newClientData, {headers: {'Authorization': 'JWT ' + window.localStorage['token']}});
    },

    create: function(user) {
      return $http.post(baseUrl + 'clients/', user, {headers: {'Authorization': 'JWT ' + window.localStorage['token']}});
    }
  }
})

.factory('Employee', function($http) {

  return {
    all: function() {
      return $http.get(baseUrl + 'employees/');
    },

    update: function(newEmployeeData) {
      return $http.put(baseUrl + 'employees/' + newEmployeeData.id + '/', newEmployeeData, {headers: {'Authorization': 'JWT ' + window.localStorage['token']}});
    },

    create: function(user) {
      return $http.post(baseUrl + 'employees/', user, {headers: {'Authorization': 'JWT ' + window.localStorage['token']}});
    }
  }
})

.factory('Service', function($http) {

  return {
    all: function() {
      return $http.get(baseUrl + 'services/');
    }
  }

})

.factory('Appointment', function($http) {

  return {
    all: function() {
      return $http.get(baseUrl + 'appointments/')
    },

    create: function(appointment) {
      return $http.post(baseUrl + 'appointments/', appointment, {headers: {'Authorization': 'JWT ' + window.localStorage['token']}})
    },

    filter: function(params) {
      return $http.get(baseUrl + 'appointments/', {
        params: params
      });
    }
  }

})

.factory('Helpers', function($http) {

  return {
    getToken: function(email, password) {
      return $http.post(baseUrl + 'api-token-auth/', {"email": email, "password": password});
    },

    getUserType: function(email) {
      return $http.get(baseUrl + 'user-type/?email=' + email);
    },

    registerUser: function(user) {
      return $http.post(baseUrl + 'register/', user);
    },

    getAvailableTimes: function(employee, service, day) {
      return $http.get(baseUrl + 'available-times/?employee=' + employee + '&service=' + service + '&day=' + day);
    }
  }

});
