var app = angular.module('intBuildApp');

app.controller('MainController', ['$scope', '$http', '$location', '$stateParams', function($scope, $http, $location, $stateParams) {
    $scope.checkIfLogged = function() {
        $http.get('/api/user/checklog').then(function(response) {
            if (response.data.logged) {
                window.location.replace('#!/home')
            };
        })
    }
}]);