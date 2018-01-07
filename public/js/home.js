var app = angular.module('intBuildApp');

app.controller('HomeController', ['$scope', '$http', '$location', '$stateParams', function($scope, $http, $location, $stateParams) {
    $scope.initHome = function() {
        /* Check if user is logged in */
        $http.get('/api/user/checklog').then(function(response) {
            if (!response.data.logged || !response.data.user.active) {
                window.location.replace('/')
            };
        })
    }
}]);