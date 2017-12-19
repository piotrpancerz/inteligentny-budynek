var app = angular.module('intBuildApp', ['ngRoute']);

app.config(function($routeProvider) {
    // $locationProvider.hashPrefix('');

    $routeProvider.when('/', {
            controller: 'IntBuildController',
            templateUrl: 'views/home.html'
        })
        .when('/login', {
            controller: 'IntBuildController',
            templateUrl: 'views/login.html'
        })
        .when('/register', {
            controller: 'IntBuildController',
            templateUrl: 'views/register.html'
        })
        .when('/home', {
            controller: 'IntBuildController',
            templateUrl: 'views/home.html'
        })
        .when('/components', {
            controller: 'IntBuildController',
            templateUrl: 'views/home.html'
        })
        .when('/chart', {
            controller: 'IntBuildController',
            templateUrl: 'views/home.html'
        })
        .otherwise({
            redirectTo: '/'
        });
});