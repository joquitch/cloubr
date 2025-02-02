'use strict';

angular.module('myApp.restServices', ['ngResource'])
    .factory('Employee', ['$resource',
        function ($resource) {
            return $resource( options.api.base_url + '/employees/:employeeId', {});
        }])
	.factory('Groups', ['$resource',
        function ($resource) {
            return $resource( options.api.base_url + '/groups/:username', {});
        }])
		
	.factory('Session', ['$resource',
        function ($resource) {
            return $resource( options.api.base_url + '/sessions/:username', {});
        }])
		
	.factory('User', ['$resource',
        function ($resource) {
            return $resource( options.api.base_url + '/users', {});
        }])

    .factory('Report', ['$resource',
        function ($resource) {
            return $resource( options.api.base_url + '/employees/:employeeId/reports', {});
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
					return $http.post( options.api.base_url + '/signin', {username: username, password: password});
				},

				logOut: function() {
					return $http.get( options.api.base_url + '/logout');
				},

				register: function(username, password, passwordConfirmation) {
					return $http.post( options.api.base_url + '/register', {username: username, password: password, passwordConfirmation: passwordConfirmation });
				}
			}
		}])
		
	.factory('TokenInterceptor', ['$rootScope', '$q', '$window', '$location', 'AuthenticationService',
		function ($rootScope, $q, $window, $location, AuthenticationService) {
			return {
				request: function (config) {
					$rootScope.loading = true;
					config.headers = config.headers || {};
					if ($window.sessionStorage.token) {
						config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
					}
					return config;
				},

				requestError: function(rejection) {
					$rootScope.loading = false;
					return $q.reject(rejection);
				},

				/* Set Authentication.isAuthenticated to true if 200 received */
				response: function (response) {
					$rootScope.loading = false;
					if (response != null && response.status == 200 && $window.sessionStorage.token && !AuthenticationService.isAuthenticated) {
						AuthenticationService.isAuthenticated = true;
					}
					return response || $q.when(response);
				},

				/* Revoke client authentication if 401 is received */
				responseError: function(rejection) {
					$rootScope.loading = false;
					if (rejection != null && rejection.status === 401 && ($window.sessionStorage.token || AuthenticationService.isAuthenticated)) {
						delete $window.sessionStorage.token;
						AuthenticationService.isAuthenticated = false;
						$location.path("/admin/login");
					}

					return $q.reject(rejection);
				}
			};
	}]);
		
		