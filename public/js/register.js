var app = angular.module('intBuildApp');

app.controller('RegisterController', ['$scope', '$http', '$location', '$stateParams', function($scope, $http, $location, $stateParams) {
    $scope.checkIfLogged = function() {
        $http.get('/api/user/checklog').then(function(response) {
            if (response.data.logged) {
                window.location.replace('#!/home')
            };
        })
    }
    $scope.register = function() {
        console.log($('#login').val())
        console.log($('#email').val())
        console.log($('#password').val())
        console.log($('#passwordConfirm').val())
    }
}]);