'use strict';

angular.module('myApp.restServices', ['ngResource'])
    .factory('Employee', ['$resource',
        function ($resource) {
            return $resource('http://localhost:5000/employees/:employeeId', {});
        }])

    .factory('Report', ['$resource',
        function ($resource) {
            return $resource('http://localhost:5000/employees/:employeeId/reports', {});
        }])
		
	.factory('AuthenticationService',
		function() {
			var auth = { isLogged: false }
			return auth;
		})
		
	.factory('UserService', ['$http',
		function($http) {
			return {
				signIn: function(username, password) {
					return $http.post('http://localhost:5000/signin', {username: username, password: password});
				},

				logOut: function() {
					return $http.get('http://localhost:5000/logout');
				},

				register: function(username, password, passwordConfirmation) {
					return $http.post('http://localhost:5000/register', {username: username, password: password, passwordConfirmation: passwordConfirmation });
				}
			}
		}])
		
	.factory('TokenInterceptor', ['$q', '$window', '$location', 'AuthenticationService',
		function ($q, $window, $location, AuthenticationService) {
			return {
				request: function (config) {
					config.headers = config.headers || {};
					if ($window.sessionStorage.token) {
						config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
					}
					return config;
				},

				requestError: function(rejection) {
					return $q.reject(rejection);
				},

				/* Set Authentication.isAuthenticated to true if 200 received */
				response: function (response) {
					if (response != null && response.status == 200 && $window.sessionStorage.token && !AuthenticationService.isAuthenticated) {
						AuthenticationService.isAuthenticated = true;
					}
					return response || $q.when(response);
				},

				/* Revoke client authentication if 401 is received */
				responseError: function(rejection) {
					if (rejection != null && rejection.status === 401 && ($window.sessionStorage.token || AuthenticationService.isAuthenticated)) {
						delete $window.sessionStorage.token;
						AuthenticationService.isAuthenticated = false;
						$location.path("/admin/login");
					}

					return $q.reject(rejection);
				}
			};
	}]);
		
		