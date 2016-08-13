'use strict';

var app = angular.module('EHRServer', [
    'ngStorage',
    'ngSanitize',
    'ngRoute'
]);

app.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {

    $routeProvider.
        when('/', {
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl'
        }).
        when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'AuthenticationCtrl'
        }).
        when('/register', {
            templateUrl: 'partials/register.html',
            controller: 'AuthenticationCtrl'
        }).
        when('/ehr', {
            templateUrl: 'partials/ehr.html',
            controller: 'EHRCtrl'
        }).
        when('/ehr/Patient/:id', {
            templateUrl: 'partials/ehr.html',
            controller: 'EHRCtrl'
        }).
        when('/myehr', {
            templateUrl: 'partials/myehr.html',
            controller: 'MyEHRCtrl'
        }).
        when('/patients', {
            templateUrl: 'partials/patients.html',
            controller: 'PatientsCtrl'
        }).
        when('/profile', {
            templateUrl: 'partials/profile.html',
            controller: 'ProfileCtrl'
        }).
        when('/parameters', {
            templateUrl: 'partials/parameters.html',
            controller: 'ParametersCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });

    $httpProvider.interceptors.push(['$q', '$log', '$location', '$localStorage', function($q, $log, $location, $localStorage) {
    		$log.debug('Inside the interceptor. token: ' + $localStorage.token);
            return {
                'request': function (config) {
                    config.headers = config.headers || {};
                    if ($localStorage.token) {
                    	config.headers['x-access-token'] = $localStorage.token;
                    }
                    return config;
                },
                'responseError': function(response) {
                    if(response.status === 401 || response.status === 403) {
                        $location.path('/login');
                    }
                    return $q.reject(response);
                }
            };
        }]);

    }
]);