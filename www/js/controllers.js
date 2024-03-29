angular.module('starter.controllers', ['ionic'])

.controller('LoginCtrl', function($scope, $location, Helpers) {

  // Function that handles login
  $scope.login = function() {
    Helpers.getToken($scope.email, $scope.password).
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
    Helpers.getUserType($scope.email).
      success(function(data, status) {
        window.localStorage['user'] = JSON.stringify(data);
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

.controller('TabCtrl', function($scope, $ionicModal, $location, $filter, Employee, Client, Service, Appointment, Helpers) {
  // Modal to create a booking
  $ionicModal.fromTemplateUrl('create-booking.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  $scope.loadEmployees = function() {
    Employee.all().
      success(function(data, status) {
        $scope.employees = data.results;
      }).
      error(function(data, status) {
        console.log('Error loading employees.');
      });
  };

  $scope.loadClients = function() {
    Client.all().
      success(function(data, status) {
        $scope.clients = data.results;
      }).
      error(function(data, status) {
        console.log('Error loading clients.');
      });
  };

  $scope.loadServices = function() {
    Service.all().
      success(function(data, status) {
        $scope.services = data.results;
        for (var i = 0; i < $scope.services.length; i++) {
          $scope.services.checked = false;
        };
      }).
      error(function(data, status) {
        console.log('Error loading services.');
      });
  };

  $scope.getTimes = function() {
    if ($scope.user.userType === 'client') {
      var employee = $scope.booking.employee;
    } else {
      var employee = $scope.user.name;
    }
    var day = $scope.booking.day;
    var service = $scope.booking.services;

    if (employee !== undefined && day !== undefined && service !== undefined) {
      Helpers.getAvailableTimes(employee, service, day)
        .success(function(data, status) {
          $scope.availableTimes = data['available_times'];
        }).
        error(function(data, status) {
          console.log('Error loading available times');
        });
    };

  };

  var init = function() {
    if (window.localStorage['token'] === undefined) {
      $location.path("/login");
    }
    $scope.loadEmployees();
    $scope.loadClients();
    $scope.loadServices();
  }
  init();

  $scope.user = JSON.parse(window.localStorage['user']);

  $scope.booking = {}

  $scope.createBooking = function() {
    if ($scope.user.userType == 'client') {
      $scope.booking.client = $scope.user.name;
    } else if ($scope.user.userType == 'employee') {
      $scope.booking.employee = $scope.user.name;
    }
    $scope.booking.services = [$scope.booking.services];

    // $scope.booking.time = $filter('date')($scope.booking.day+'T'+$scope.booking.time, 'hh:mm a');

    Appointment.create($scope.booking).
      success(function(data, status) {
        alert('La cita se creo exitosamente.');
        $scope.booking.services = $scope.booking.services[0];
      }).
      error(function(data, status) {
        alert('Error creando la cita.');
        $scope.booking.services = $scope.booking.services[0];
      });
  };
})

.controller('CitasCtrl', function($scope, $ionicPopup, Client, Employee, Appointment) {

  $scope.currentAppointments = [];

  $scope.getAppointments = function() {
    var params = {};
    params.day = $scope.currentDate.date;
    params[$scope.user.userType] = $scope.user.id;
    params.ordering = 'time';
    Appointment.filter(params).
      success(function(data, status) {
        $scope.currentAppointments = data.results;
        if ($scope.user.userType == 'employee') {
          Client.all().success($scope.addPhoneNumbers);
        } else {
          Employee.all().success($scope.addPhoneNumbers);
        }
      }).
      error(function(data, status) {
        console.log('Error buscando citas del día.');
      }).
      finally(function() {
        $scope.$broadcast('scroll.refreshComplete');
      }
    );

  };

  $scope.addPhoneNumbers = function(data, status) {
    for (var i = 0; i < $scope.currentAppointments.length; i++) {
      for (var j = 0; j < data.results.length; j++) {
        if ($scope.user.userType == 'employee') {
          if (data.results[j].name == $scope.currentAppointments[i].client) {
            $scope.currentAppointments[i]['phone_number'] = data.results[j]['phone_number']
          }
        } else if ($scope.user.userType == 'client') {
          if (data.results[j].name == $scope.currentAppointments[i].employee) {
            $scope.currentAppointments[i]['phone_number'] = data.results[j]['phone_number']
          }
        }
      }
    }
  };

  var date = new Date();
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  if(day < 10) {
      day = '0' + day;
  }
  if(month < 10) {
      month = '0' + month;
  }

  $scope.currentDate = { 'date': year + '-' + month + '-' + day };

  $scope.getAppointments();


  $scope.parseDate = function(date){

    var months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago",
    "Sep", "Oct", "Nov", "Dic"];

    var dateS = date.split("-");

    var month = parseInt(dateS[1]);

    month = months[month-1];

    var newDate = month + " " + dateS[2] + ", " + dateS[0];

    return newDate;
  }

  $scope.parsedCurrentDate = $scope.parseDate($scope.currentDate.date);


  // Popup to select a date
  $scope.showPopup = function() {
    var myPopup = $ionicPopup.show({
      templateUrl: 'date-picker.html',
      title: 'Seleccione la fecha',
      scope: $scope,
      buttons: [
        { text: 'Cancelar' },
        {
          text: '<b>Guardar</b>',
          type: 'button-positive',
          onTap: function(e) {
            return $scope.currentDate.date;
          }
        },
      ]
    }).then(function(res) {
      $scope.getAppointments();
        $scope.parsedCurrentDate = $scope.parseDate($scope.currentDate.date);

    });
  };

})

.controller('HistoryCtrl', function($scope, Appointment) {

  $scope.parseDate = function(date){

    var months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago",
    "Sep", "Oct", "Nov", "Dic"];

    var dateS = date.split("-");

    var month = parseInt(dateS[1]);

    month = months[month-1];

    var newDate = month + " " + dateS[2] + ", " + dateS[0];

    return newDate;
  }

  $scope.pastAppointments = [];

  $scope.getPastAppointments = function() {
    var params = {};
    params[$scope.user.userType] = $scope.user.id;
    params.ordering = 'day';
    Appointment.filter(params).
      success(function(data, status) {
        $scope.pastAppointments = data.results;
      }).
      error(function(data, status) {
        console.log('Error buscando citas pasadas.');
      }).finally(function() {
        $scope.$broadcast('scroll.refreshComplete');
      }
    );
  }

  $scope.getPastAppointments();

})

.controller('AccountCtrl', function($scope, Business, Employee, Client, Helpers) {
  $scope.editMode = false;

  $scope.toggleEditMode = function() {
    $scope.editMode = true;
  }

  $scope.save = function() {
    $scope.user.business = $scope.selectedBusiness.business.id;

    var updateFunction;
    if ($scope.user.userType == 'employee') {
      updateFunction = Employee.update;
    } else if ($scope.user.userType == 'client') {
      updateFunction = Client.update;
    }

    // On success redirect to the home page
    updateFunction($scope.user).
      success(function(data, status, headers, config) {
        Helpers.getUserType($scope.user.email).
        success(function(data, status) {
          alert('Su perfil se guardo exitosamente.');
          delete window.localStorage['user'];
          window.localStorage['user'] = JSON.stringify(data);
          $scope.editMode = false;
        }).
        error(function(data, status) {
          alert('Error actualizando al perfil.');
        })
      }).
      error(function(data, status, headers, config) {
        alert('Error guardando el perfil.');
      });
  }

  // Populates the business select input
  $scope.businesses = [];
  $scope.selectedBusiness = {};
  var handleSuccess = function(data, status) {
    $scope.businesses = data.results;
    console.log($scope.businesses);
  }
  Business.all().success(handleSuccess);


})

// Abstract control for registration that handles all of the actual registration
// logic. TODO: All sorts of sanity checks and input validations
.controller('RegisterCtrl', function($scope, $location, Helpers, Business, Client, Employee) {

  // Function to go back to login
  $scope.back = function() {
    $location.path("/login");
  };

  // Function to login after actually creating a user.
  $scope.login = function() {
    Helpers.getToken($scope.user.email, $scope.user.password).
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
    Helpers.registerUser($scope.user).
      // On success attempt to login.
      success($scope.login).
      error(function(data, status, headers, config) {
        alert('Error creating user. Please contact Christian.');
      });
  }

  $scope.findUserType = function() {
    Helpers.getUserType($scope.user.email).
      success(function(data, status) {
        window.localStorage['user'] = JSON.stringify(data);
        $location.path("/tab/citas");
      }).
      error(function(data, status) {
        alert('Error encontrando al usuario.');
      })
  }

  // Function that actually creates the object in the server
  // Note: Login must be succesful for this to work.
  $scope.createObject = function() {

    var createObjectFunction;

    if ($scope.user.objectType == 'business') {
      createObjectFunction = Business.create;
    } else if ($scope.user.objectType == 'employee') {
      createObjectFunction = Employee.create;
    } else if ($scope.user.objectType == 'client') {
      createObjectFunction = Client.create;
    }

    createObjectFunction($scope.user).
      // On success redirect to the home page
      success(function(data, status, headers, config) {
        $scope.findUserType();
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
  $scope.user.objectType = 'business';
})

// Controller for registering Employees
.controller('RegisterEmployeeCtrl', function($scope, $location, Business) {
  $scope.user.objectType = 'employee';

  // Populates the business select input
  $scope.businesses = [];
  var handleSuccess = function(data, status) {
    $scope.businesses = data.results;
  }
  Business.all().success(handleSuccess);
})

// Controller for registering Clients
.controller('RegisterClientCtrl', function($scope, $location) {
  $scope.user.objectType = 'client';
});


