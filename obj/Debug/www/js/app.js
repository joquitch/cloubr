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
    'myApp.restServices',
    'myApp.directives'
])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
			
		.when('/employees/:employeeId', {
			templateUrl: 'partials/employee-detail.html',
			controller: 'EmployeeDetailCtrl',
			access: { requiredAuthentication: true }
		})
		
		.when('/groups/:username', {
			templateUrl: 'partials/groups.html',
			controller: 'GroupsCtrl',
			access: { requiredAuthentication: true }
		})
		
		.when('/sessionsOverview/:username', {
			templateUrl: 'partials/sessionsOverview.html',
			controller: 'SessionsOverviewCtrl',
			access: { requiredAuthentication: true }
		})
		
		.when('/selectParticipants', {
			templateUrl: 'partials/selectParticipants.html',
			controller: 'SelectParticipantsCtrl',
			access: { requiredAuthentication: true }
		})
		
		.when('/newSession', {
			templateUrl: 'partials/newSession.html',
			controller: 'NewSessionCtrl',
			access: { requiredAuthentication: true }
		})
		
		.when('/employees/:employeeId/reports', {
			templateUrl: 'partials/report-list.html',
			controller: 'ReportListCtrl',
			access: { requiredAuthentication: true }
		})
		
		.when('/register', {
            templateUrl: 'partials/register.html'
        })
		
        .when('/logout', {
            templateUrl: 'partials/logout.html',
            access: { requiredAuthentication: true }
        })
		
		.otherwise({
			redirectTo: '/register'
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

            $location.path("/register");
        }
    });
});


