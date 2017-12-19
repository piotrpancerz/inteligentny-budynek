var app = angular.module('intBuildApp', ['ngRoute']);

app.config(function($routeProvider) {
    // $locationProvider.hashPrefix('');

    $routeProvider.when('/', {
            templateUrl: 'views/home.html'
        })
        .when('/login', {
            templateUrl: 'views/login.html'
        })
        .when('/register', {
            templateUrl: 'views/register.html'
        })
        .when('/home', {
            templateUrl: 'views/home.html'
        })
        .when('/components', {
            templateUrl: 'views/home.html'
        })
        .when('/chart', {
            templateUrl: 'views/home.html'
        })
        .otherwise({
            redirectTo: '/'
        });
});