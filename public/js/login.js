var app = angular.module('intBuildApp');

app.controller('LoginController', ['$scope', '$http', '$location', '$stateParams', function($scope, $http, $location, $stateParams) {
    $scope.checkIfLogged = function() {
        /* Check if user is logged in */
        $http.get('/api/user/checklog').then(function(response) {
            if (response.data.logged) {
                window.location.replace('#!/components');
            }
        })
    }
    $scope.login = function() {
        /* Send user data to database and log in or send error message */
        $http.post('/api/user/login', $scope.user).then(function(response) {
            if (response.data.logged) {
                window.location.replace('#!/components');
                $scope.user = {
                    username: response.data.user.username,
                    active: response.data.user.active
                }
            } else {
                $('#username').parent().addClass('has-error');
                $('#password').parent().addClass('has-error');
                $('#username').val('');
                $('#password').val('');
                $('#errorMessage').text('Invalid username or password!');
            }
        })
    }
}]);