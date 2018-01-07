var app = angular.module('intBuildApp');

app.controller('ChartsController', ['$scope', '$http', '$location', '$stateParams', function($scope, $http, $location, $stateParams) {
    $scope.load = function() {
        /* Load component data from server */
        $http.get('/api/component/get/' + $scope.componentId).then(function(response) {
            if (!response.data.found) {
                window.location.replace('#!/components');
            } else if (response.data.component === undefined || response.data.component.length == 0) {
                window.location.replace('#!/components');
            } else {
                /* Define component */
                $scope.component = response.data.component;

                /* Define initial data on charts */
                $scope.initializeDataOnCharts();

                /* Create sliders */
                $scope.initializeSliders();

                /* Initialize chart options */
                $scope.initializeChartsOptions();

                /* Changes on time range slider value change */
                $('#timeRange').on('change', function() {
                    $scope.timeMinVal = $(this).slider('getValue')[0];
                    $scope.timeMaxVal = $(this).slider('getValue')[1];
                    $scope.xAxisData.current = $scope.xAxisData.master.slice($scope.timeMinVal, $scope.timeMaxVal + 1);
                    $scope.yAxisData.current = $scope.yAxisData.master.slice($scope.timeMinVal, $scope.timeMaxVal + 1);
                    $scope.lineChartOptions.title.text[1] = 'Since ' + $scope.xAxisData.master[$scope.timeMinVal] + ' till ' + $scope.xAxisData.master[$scope.timeMaxVal];
                    $scope.regulationData = [
                        parseFloat($scope.regulationHistory.slice($scope.timeMinVal, $scope.timeMaxVal + 1).filter(function(x) { return x == true }).length / $scope.regulationHistory.slice($scope.timeMinVal, $scope.timeMaxVal + 1).length * 100).toFixed(2)
                    ];
                    $scope.regulationData.push(parseFloat(100 - $scope.regulationData[0]).toFixed(2));
                    $scope.regulationChartOptions.title.text = ['Regulation factor over time', 'Since ' + $scope.xAxisData.master[$scope.timeMinVal] + ' till ' + $scope.xAxisData.master[$scope.timeMaxVal]];

                    $scope.valueChartData = [
                        parseFloat($scope.yAxisData.current.filter(function(x) { return (Number(x) <= Number($scope.rangeMaxVal) && Number(x) >= Number($scope.rangeMinVal)) }).length / $scope.yAxisData.current.length * 100).toFixed(2),
                    ];
                    $scope.valueChartData.push(parseFloat(100 - $scope.valueChartData[0]).toFixed(2));
                    $('.timeRange .slider .tooltip .tooltip-inner').text($scope.xAxisData.master[$scope.timeMinVal] + ' : ' + $scope.xAxisData.master[$scope.timeMaxVal]);
                    $scope.valueChartOptions.title.text[2] = 'Since ' + $scope.xAxisData.master[$scope.timeMinVal] + ' till ' + $scope.xAxisData.master[$scope.timeMaxVal];
                });

                /* Changes on time range slider stop sliding */
                $('#timeRange').on('slideStop', function() {
                    $scope.timeMinVal = $(this).slider('getValue')[0];
                    $scope.timeMaxVal = $(this).slider('getValue')[1];
                    $scope.$apply();
                    $('.timeRange .slider .tooltip .tooltip-inner').text($scope.xAxisData.master[$scope.timeMinVal] + ' : ' + $scope.xAxisData.master[$scope.timeMaxVal]);
                });

                /* Changes on value range slider value change */
                $('#valueRange').on('change', function() {
                    $scope.rangeMinVal = $(this).slider('getValue')[0];
                    $scope.rangeMaxVal = $(this).slider('getValue')[1];
                    $scope.valueChartData = [
                        parseFloat($scope.yAxisData.current.filter(function(x) { return (Number(x) <= Number($scope.rangeMaxVal) && Number(x) >= Number($scope.rangeMinVal)) }).length / $scope.yAxisData.current.length * 100).toFixed(2),
                    ];
                    $scope.valueChartData.push(parseFloat(100 - $scope.valueChartData[0]).toFixed(2));
                    switch ($scope.component.type) {
                        case 'Temperature':
                            $('.valueRange .slider .tooltip .tooltip-inner').html($scope.rangeMinVal + ' &#x2103 : ' + $scope.rangeMaxVal + ' &#x2103');
                            $scope.valueChartOptions.title.text[1] = 'In range from ' + $scope.rangeMinVal + ' C to ' + $scope.rangeMaxVal + ' C';
                            break;
                        case 'Humidity':
                            $('.valueRange .slider .tooltip .tooltip-inner').html($scope.rangeMinVal + ' % : ' + $scope.rangeMaxVal + ' %');
                            $scope.valueChartOptions.title.text[1] = 'In range from ' + $scope.rangeMinVal + ' % to ' + $scope.rangeMaxVal + ' %';
                            break;
                        case 'Pressure':
                            $('.valueRange .slider .tooltip .tooltip-inner').html($scope.rangeMinVal + ' hPa : ' + $scope.rangeMaxVal + ' hPa');
                            $scope.valueChartOptions.title.text[1] = 'In range from ' + $scope.rangeMinVal + ' hPa to ' + $scope.rangeMaxVal + ' hPa';
                            break;
                        case 'Binary Switch':
                            $('.valueRange .slider .tooltip .tooltip-inner').html($scope.rangeMinVal + ' : ' + $scope.rangeMaxVal);
                            $scope.valueChartOptions.title.text[1] = 'In range from ' + $scope.rangeMinVal + ' to ' + $scope.rangeMaxVal;
                            break;
                    };
                });

                /* Changes on value range slider stop sliding */
                $('#valueRange').on('slideStop', function() {
                    $scope.rangeMinVal = $(this).slider('getValue')[0];
                    $scope.rangeMaxVal = $(this).slider('getValue')[1];
                    $scope.$apply();
                    switch ($scope.component.type) {
                        case 'Temperature':
                            $('.valueRange .slider .tooltip .tooltip-inner').html($scope.rangeMinVal + ' &#x2103 : ' + $scope.rangeMaxVal + ' &#x2103');
                            break;
                        case 'Humidity':
                            $('.valueRange .slider .tooltip .tooltip-inner').html($scope.rangeMinVal + ' % : ' + $scope.rangeMaxVal + ' %');
                            break;
                        case 'Pressure':
                            $('.valueRange .slider .tooltip .tooltip-inner').html($scope.rangeMinVal + ' hPa : ' + $scope.rangeMaxVal + ' hPa');
                            break;
                        case 'Binary Switch':
                            $('.valueRange .slider .tooltip .tooltip-inner').html($scope.rangeMinVal + ' : ' + $scope.rangeMaxVal);
                            break;
                    };
                });
            }
        });
    }

    $scope.initChart = function() {
        /* Check if user is logged in */
        $http.get('/api/user/checklog').then(function(response) {
            if (!response.data.logged || !response.data.user.active) {
                window.location.replace('/')
            } else {
                $scope.user = response.data.user;
            };
        });

        /* Get component id to load from URL */
        $scope.componentId = $location.$$url.replace('/chart/', '');

        /* Load component data */
        $scope.load();

        /* Change on select choice value change */
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
                    $('div.form-group.value-chart').removeClass('hidden');
                    break;
            }

        });
    }

    $scope.initializeSliders = function() {
        /* Create Time Range slider */
        $("#timeRange").slider({
            min: 0,
            max: $scope.xAxisData.master.length - 1,
            step: 1,
            value: [0, $scope.xAxisData.master.length],
            enabled: true,
        });
        $("#timeRange").slider('refresh');

        /* Customize Time Range slider tooltip */
        $scope.timeMinVal = $('#timeRange').slider('getValue')[0];
        $scope.timeMaxVal = $('#timeRange').slider('getValue')[1];
        $('.timeRange .slider .tooltip .tooltip-inner').text($scope.xAxisData.master[$scope.timeMinVal] + ' : ' + $scope.xAxisData.master[$scope.timeMaxVal]);

        /* Create Value Range slider based on component type */
        switch ($scope.component.type) {
            case 'Temperature':
            case 'Humidity':
            case 'Pressure':
                $("#valueRange").slider({
                    min: $scope.component.range[0],
                    max: $scope.component.range[1],
                    step: $scope.component.resolution,
                    value: [$scope.component.range[0], $scope.component.range[1]],
                    enabled: true,
                });
                $("#valueRange").slider('refresh');
                break;
            case 'Binary Switch':
                $("#valueRange").slider({
                    min: $scope.component.range[0],
                    max: $scope.component.range[1],
                    step: $scope.component.resolution,
                    value: [$scope.component.range[0], $scope.component.range[1]],
                    enabled: false,
                });
                $("#valueRange").slider('refresh');
                break;
        };
        $scope.rangeMinVal = $('#valueRange').slider('getValue')[0];
        $scope.rangeMaxVal = $('#valueRange').slider('getValue')[1];
    }

    $scope.initializeDataOnCharts = function() {
        /* For - Time view */
        $scope.yAxisData = {
            master: $scope.component.data,
            current: $scope.component.data
        };
        $scope.xAxisData = {
            master: [],
            current: []
        };
        for (eachTick in $scope.yAxisData.master) {
            var timeObject = moment($scope.component.creation_date).add(eachTick, 'minutes').format('lll');
            $scope.xAxisData.master.push(timeObject);
            $scope.xAxisData.current.push(timeObject);
        }

        /* For - Regulation factor over time*/
        $scope.regulationHistory = $scope.component.regulation_history;
        $scope.regulationData = [
            parseFloat($scope.component.regulation_history.filter(function(x) { return x == true }).length / $scope.component.regulation_history.length * 100).toFixed(2)
        ];
        $scope.regulationData.push(parseFloat(100 - $scope.regulationData[0]).toFixed(2));

        /* For - Occurance of certain values*/
        $scope.valueChartData = [
            parseFloat($scope.yAxisData.current.filter(function(x) { return (Number(x) <= Number($scope.component.range[1]) && Number(x) >= Number($scope.component.range[0])) }).length / $scope.yAxisData.current.length * 100).toFixed(2),
        ];
        $scope.valueChartData.push(parseFloat(100 - $scope.valueChartData[0]).toFixed(2));
    }

    $scope.initializeChartsOptions = function() {
        /* For - Time View */
        $scope.lineChartOptions = {
            title: {
                display: true,
                text: ['Amplitude of component\'s value over time', 'Since ' + $scope.xAxisData.master[$scope.timeMinVal] + ' till ' + $scope.xAxisData.master[$scope.timeMaxVal]],
                fontSize: 15
            },
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Date'
                    }
                }]
            }
        }

        /* For - Regulation Factor over time */
        $scope.regulationChartOptions = {
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        return data.labels[tooltipItem.index] + ' - ' + data.datasets[0]['data'][tooltipItem.index] + '%'
                    }
                }
            },
            legend: {
                display: true
            },
            title: {
                display: true,
                text: ['Regulation factor over time', 'Since ' + $scope.xAxisData.master[$scope.timeMinVal] + ' till ' + $scope.xAxisData.master[$scope.timeMaxVal]],
                fontSize: 15
            }
        }

        /* For - Occurance of certain values */
        $scope.valueChartOptions = {
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        return data.labels[tooltipItem.index] + ' - ' + data.datasets[0]['data'][tooltipItem.index] + '%'
                    }
                }
            },
            legend: {
                display: true
            },
            title: {
                display: true,
                fontSize: 15
            }
        }

        /* For - All - Differ chart options based on component type */
        switch ($scope.component.type) {
            case 'Temperature':
                $('.valueRange .slider .tooltip .tooltip-inner').html($scope.component.range[0] + ' &#x2103 : ' + $scope.component.range[1] + ' &#x2103');
                $scope.valueChartOptions.title.text = ['Percentage occurance of values', 'In range from ' + $scope.rangeMinVal + ' C to ' + $scope.rangeMaxVal + ' C', 'Since ' + $scope.xAxisData.master[$scope.timeMinVal] + ' till ' + $scope.xAxisData.master[$scope.timeMaxVal]];
                $scope.lineChartOptions.scales.yAxes = [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Temperature (C)'
                    }
                }]
                break;
            case 'Humidity':
                $('.valueRange .slider .tooltip .tooltip-inner').html($scope.component.range[0] + ' % : ' + $scope.component.range[1] + ' %');
                $scope.valueChartOptions.title.text = ['Percentage occurance of values', 'In range from ' + $scope.rangeMinVal + ' % to ' + $scope.rangeMaxVal + ' %', 'Since ' + $scope.xAxisData.master[$scope.timeMinVal] + ' till ' + $scope.xAxisData.master[$scope.timeMaxVal]];
                $scope.lineChartOptions.scales.yAxes = [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Humidity (%)'
                    }
                }]
                break;
            case 'Pressure':
                $('#chartKindSelect li:nth-child(2)').addClass('disabled');
                $('.valueRange .slider .tooltip .tooltip-inner').html($scope.component.range[0] + ' hPa : ' + $scope.component.range[1] + ' hPa');
                $scope.valueChartOptions.title.text = ['Percentage occurance of values', 'In range from ' + $scope.rangeMinVal + ' hPa to ' + $scope.rangeMaxVal + ' hPa', 'Since ' + $scope.xAxisData.master[$scope.timeMinVal] + ' till ' + $scope.xAxisData.master[$scope.timeMaxVal]];
                $scope.lineChartOptions.scales.yAxes = [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Pressure (hPa)'
                    }
                }]
                break;
            case 'Binary Switch':
                $('#chartKindSelect li:nth-child(3)').addClass('disabled');
                $('.valueRange .slider .tooltip .tooltip-inner').html($scope.component.range[0] + ' : ' + $scope.component.range[1]);
                $scope.valueChartOptions.title.text = ['Percentage occurance of values', 'In range from ' + $scope.rangeMinVal + ' to ' + $scope.rangeMaxVal, 'Since ' + $scope.xAxisData.master[$scope.timeMinVal] + ' till ' + $scope.xAxisData.master[$scope.timeMaxVal]];
                $scope.lineChartOptions.scales.yAxes = [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Logical value'
                    }
                }]
                break;
        };
    }
}]);