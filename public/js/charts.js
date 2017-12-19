var app = angular.module('intBuildApp');

app.controller('ChartsController', ['$scope', '$http', '$location', '$stateParams', function($scope, $http, $location, $stateParams) {
    $scope.initCharts = function() {
        $http.get('/api/user/checklog').then(function(response) {
            if (!response.data.logged) {
                window.location.replace('/')
            };
        })
    }
}]);