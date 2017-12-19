var app = angular.module('intBuildApp');

app.controller('ComponentsController', ['$scope', '$http', '$location', '$stateParams', function($scope, $http, $location, $stateParams) {
    $scope.initComponents = function() {
        $http.get('/api/user/checklog').then(function(response) {
            if (!response.data.logged) {
                window.location.replace('/')
            };
        })
    }
}]);