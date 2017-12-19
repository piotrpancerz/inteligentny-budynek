var app = angular.module('intBuildApp');

app.controller('RegisterController', ['$scope', '$http', '$location', '$stateParams', function($scope, $http, $location, $stateParams) {
    $scope.checkIfNotLogged = function() {
        console.log('xx');
    }
    $scope.register = function() {
        console.log($('#login').val())
        console.log($('#email').val())
        console.log($('#password').val())
        console.log($('#passwordConfirm').val())
    }
}]);