'use strict';

angular.module('myApp.controllers', [])
    .controller('MainCtrl', ['$scope', '$rootScope', '$window', '$location', function ($scope, $rootScope, $window, $location) {
        $scope.slide = '';
        $rootScope.back = function() {
          $scope.slide = 'slide-right';
          $window.history.back();
        }
        $rootScope.go = function(path){
          $scope.slide = 'slide-left';
          $location.url(path);
        }
    }])
    .controller('EmployeeListCtrl', ['$scope', 'Employee',
		function ($scope, Employee) {
			$scope.employees = Employee.query();
		}
	])
    .controller('EmployeeDetailCtrl', ['$scope', '$routeParams', 'Employee',
		function ($scope, $routeParams, Employee) {
			$scope.employee = Employee.get({employeeId: $routeParams.employeeId});
		}
	])
    .controller('ReportListCtrl', ['$scope', '$routeParams', 'Report',
		function ($scope, $routeParams, Report) {
			$scope.employees = Report.query({employeeId: $routeParams.employeeId});
		}
	])
	
	.controller('UserCtrl', ['$scope', '$location', '$window', 'UserService', 'AuthenticationService',
		function UserCtrl($scope, $location, $window, UserService, AuthenticationService) {
	 
			//Admin User Controller (signIn, logOut)
			$scope.signIn = function signIn(username, password) {
				if (username != null && password != null) {

					UserService.signIn(username, password).success(function(data) {
						AuthenticationService.isAuthenticated = true;
						$window.sessionStorage.token = data.token;
						$location.path("/");
					}).error(function(status, data) {
						console.log(status);
						console.log(data);
					});
				}
			}

			$scope.logOut = function logOut() {
				if (AuthenticationService.isAuthenticated) {
					
					UserService.logOut().success(function(data) {
						AuthenticationService.isAuthenticated = false;
						delete $window.sessionStorage.token;
						$location.path("/");
					}).error(function(status, data) {
						console.log(status);
						console.log(data);
					});
				}
				else {
					$location.path("/login");
				}
			}

			$scope.register = function register(username, password, passwordConfirm) {
				if (AuthenticationService.isAuthenticated) {
					$location.path("/");
				}
				else {
					UserService.register(username, password, passwordConfirm).success(function(data) {
						$location.path("/login");
					}).error(function(status, data) {
						console.log(status);
						console.log(data);
					});
				}
			}
		}
	]);