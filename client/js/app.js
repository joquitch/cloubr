'use strict';

var options = {};
options.api = {};
//options.api.base_url = 'http://frozen-stream-3247.herokuapp.com';
options.api.base_url = 'http://localhost:5000';

angular.module('myApp', [
    'ngTouch',
    'ngRoute',
    'ngAnimate',
    'myApp.controllers',
    'myApp.restServices'
]).

config(['$routeProvider', function ($routeProvider) {
    $routeProvider
		.when('/employees', {
			templateUrl: 'partials/employee-list.html',
			controller: 'EmployeeListCtrl',
			access: { requiredAuthentication: true }
		})
		
		.when('/employees/:employeeId', {
			templateUrl: 'partials/employee-detail.html',
			controller: 'EmployeeDetailCtrl',
			access: { requiredAuthentication: true }
		})
		
		.when('/employees/:employeeId/reports', {
			templateUrl: 'partials/report-list.html',
			controller: 'ReportListCtrl',
			access: { requiredAuthentication: true }
		})
		
		.when('/register', {
            templateUrl: 'partials/register.html',
            controller: 'UserCtrl'
        })
		
        .when('/login', {
            templateUrl: 'partials/signin.html',
            controller: 'UserCtrl'
        })
		
        .when('/logout', {
            templateUrl: 'partials/logout.html',
            controller: 'UserCtrl',
            access: { requiredAuthentication: true }
        })
		
		.otherwise({
			redirectTo: '/employees'
		});
}])

.config(function ($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
})

.run(function($rootScope, $location, $window, AuthenticationService) {
    $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
        //redirect only if both isAuthenticated is false and no token is set
        if (nextRoute != null && nextRoute.access != null && nextRoute.access.requiredAuthentication 
            && !AuthenticationService.isAuthenticated && !$window.sessionStorage.token) {

            $location.path("/login");
        }
    });
});;