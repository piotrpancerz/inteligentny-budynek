var app = angular.module('intBuildApp');

app.controller('LoginController', ['$scope', '$http', '$location', '$stateParams', function($scope, $http, $location, $stateParams) {
    $scope.checkIfLogged = function() {
        $http.get('/api/user/checklog').then(function(response) {
            if (response.data.logged) {
                window.location.replace('#!/home');
            }
        })
    }
    $scope.login = function() {
        $http.post('/api/user/login', $scope.user).then(function(response) {
            if (response.data.logged) {
                window.location.replace('#!/home');
            } else {
                $('#username').parent().addClass('has-error');
                $('#password').parent().addClass('has-error');
            }
        })
    }
}]);