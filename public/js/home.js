var app = angular.module('intBuildApp');

app.controller('HomeController', ['$scope', '$http', '$location', '$stateParams', function($scope, $http, $location, $stateParams) {
    $scope.initHome = function() {
        $http.get('/api/user/checklog').then(function(response) {
            if (!response.data.logged) {
                window.location.replace('/')
            };
        })
    }
}]);