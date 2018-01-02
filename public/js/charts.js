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
                $scope.yAxisData = {
                    master: response.data.component.data,
                    current: response.data.component.data
                };
                $scope.xAxisData = {
                    master: [],
                    current: []
                };
                for (eachTick in $scope.yAxisData.master) {
                    var timeObject = moment(response.data.component.creation_date).add(eachTick, 'minutes').format('lll');
                    $scope.xAxisData.master.push(timeObject);
                    $scope.xAxisData.current.push(timeObject);
                }
                $("#chartRange").slider({
                    min: 0,
                    max: $scope.xAxisData.master.length,
                    step: 1,
                    value: [0, $scope.xAxisData.master.length],
                    enabled: true
                });
                $("#chartRange").slider('refresh');
                $('#chartRange').on('change', function() {
                    var minVal = $(this).slider('getValue')[0];
                    var maxVal = $(this).slider('getValue')[1];
                    $scope.xAxisData.current = $scope.xAxisData.master.slice(minVal, maxVal);
                    $scope.yAxisData.current = $scope.yAxisData.master.slice(minVal, maxVal);
                    $scope.$apply();
                });
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
        $scope.componentId = $location.$$url.replace('/chart/', '');
        $scope.load();
    }
}]);