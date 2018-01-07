var app = angular.module('intBuildApp');

app.controller('MainController', ['$scope', '$http', '$location', '$stateParams', function($scope, $http, $location, $stateParams) {
    $scope.checkIfLogged = function() {
        /* Check if user is logged in */
        $http.get('/api/user/checklog').then(function(response) {
            if (response.data.logged && response.data.user.active) {
                window.location.replace('#!/home');
            } else if (response.data.logged && !response.data.user.active) {
                window.location.replace('#!/authenticate');
            }
        })
    }
}]);