var app = angular.module('intBuildApp');

app.controller('ChartsController', ['$scope', '$http', '$location', '$stateParams', function($scope, $http, $location, $stateParams) {
    $scope.load = function() {
        $http.get('/api/component/get/' + $scope.componentId).then(function(response) {
            if (!response.data.found) {
                window.location.replace('#!/components');
            } else if (response.data.component === undefined || response.data.component.length == 0) {
                window.location.replace('#!/components');
            } else {
                $scope.component = response.data.component;
                $scope.data = response.data.component.data;
            }
        });
    }

    $scope.initChart = function() {
        $http.get('/api/user/checklog').then(function(response) {
            if (!response.data.logged || !response.data.user.active) {
                window.location.replace('/')
            } else {
                $scope.user = response.data.user;
            };
        });
        $scope.data = [];
        $scope.componentId = $location.$$url.replace('/chart/', '');
        $scope.load();
        // var chart = $("#lineChart");
        // var myChart = new Chart(chart, {
        //     type: 'line',
        //     data: $scope.component.data
        // });
    }
}]);