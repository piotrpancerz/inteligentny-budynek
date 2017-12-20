var app = angular.module('intBuildApp');

app.controller('RemoveController', ['$scope', '$http', '$location', '$stateParams', function($scope, $http, $location, $stateParams) {
    $scope.initRemove = function() {
        $http.get('/api/user/checklog').then(function(response) {
            if (!response.data.logged || !response.data.user.active) {
                window.location.replace('/')
            };
        })
    }
}]);