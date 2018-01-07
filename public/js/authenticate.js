var app = angular.module('intBuildApp');

app.controller('AuthenticateController', ['$scope', '$http', '$location', '$stateParams', function($scope, $http, $location, $stateParams) {
    $scope.initAuthenticate = function() {
        $http.get('/api/user/checklog').then(function(response) {
            /* Check if user is logged in */
            if (!response.data.logged) {
                window.location.replace('/');
            } else if (response.data.logged && response.data.user.active) {
                window.location.replace('#!/home')
            }
            $scope.user = response.data.user;
        });
    }
}]);