var app = angular.module('intBuildApp');

app.controller('LoginController', ['$scope', '$http', '$location', '$stateParams', function($scope, $http, $location, $stateParams) {
    $scope.checkIfNotLogged = function() {
        $http.get('/api/user/checknotlog').then(function(response) {
            console.log('true');
        })
    }
    $scope.login = function() {
        console.log($('#login').val())
        console.log($('#password').val())
    }
}]);