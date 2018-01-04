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
                $scope.regulationHistory = response.data.component.regulation_history;
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
                $("#timeRange").slider({
                    min: 0,
                    max: $scope.xAxisData.master.length - 1,
                    step: 1,
                    value: [0, $scope.xAxisData.master.length],
                    enabled: true,
                    formatter: function(value) {
                        return 'Current value : ' + value;
                    }
                });
                $("#timeRange").slider('refresh');
                var minVal = $('#timeRange').slider('getValue')[0];
                var maxVal = $('#timeRange').slider('getValue')[1];
                $('.slider:nth-of-type(1) .tooltip .tooltip-inner').text($scope.xAxisData.master[minVal] + ' : ' + $scope.xAxisData.master[maxVal]);


                $('#timeRange').on('change', function() {
                    var minVal = $(this).slider('getValue')[0];
                    var maxVal = $(this).slider('getValue')[1];
                    $scope.xAxisData.current = $scope.xAxisData.master.slice(minVal, maxVal);
                    $scope.yAxisData.current = $scope.yAxisData.master.slice(minVal, maxVal);
                    $('.slider:nth-of-type(1) .tooltip .tooltip-inner').text($scope.xAxisData.master[minVal] + ' : ' + $scope.xAxisData.master[maxVal]);
                });
                $('#timeRange').on('slideStop', function() {
                    $scope.$apply();
                    var minVal = $(this).slider('getValue')[0];
                    var maxVal = $(this).slider('getValue')[1];
                    $('.slider:nth-of-type(1) .tooltip .tooltip-inner').text($scope.xAxisData.master[minVal] + ' : ' + $scope.xAxisData.master[maxVal]);
                });
                $('#chartKindSelect').on('change', function() {
                    $('div.form-group:not(.mainSelect)').addClass('hidden');
                    switch ($scope.chartKind) {
                        case 'Time View':
                            $('div.form-group.line-chart').removeClass('hidden');
                            break;
                        case 'Regulation Percentage':
                            $('div.form-group.regulation-chart').removeClass('hidden');
                            break;
                        case 'Value Range Percentage':
                            $('div.form-group.range-chart').removeClass('hidden');
                            break;
                        default:
                            break;
                    }

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