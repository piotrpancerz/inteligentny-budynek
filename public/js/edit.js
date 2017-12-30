var app = angular.module('intBuildApp');

app.controller('EditController', ['$scope', '$http', '$location', '$stateParams', function($scope, $http, $location, $stateParams) {
    $scope.load = function() {
        $http.get('/api/component/get/' + $scope.componentId).then(function(response) {
            if (!response.data.found) {
                window.location.replace('#!/components');
            } else if (response.data.component === undefined || response.data.component.length == 0) {
                window.location.replace('#!/components');
            } else {
                $scope.component = response.data.component;
                $('div.form-group.component').addClass('hidden');
                $('#componentDesiredValueActive').prop('checked', $scope.component.regulation);
                $("#componentResolution").slider({
                    min: 0.01,
                    max: 10,
                    value: $scope.component.resolution,
                    scale: 'logarithmic',
                    step: 0.01,
                    ticks: [0.01, 0.1, 1, 10],
                    ticks_snap_bounds: 0.1,
                    enabled: true
                });
                $("#componentResolution").slider('refresh');
                switch ($scope.component.type) {
                    case 'Temperature':
                        $scope.icons = [{
                                name: 'Oven',
                                file: '005-oven.svg',
                                link: '/../icons/005-oven.svg'
                            },
                            {
                                name: 'Temperature',
                                file: '007-temperature.svg',
                                link: '/../icons/007-temperature.svg'
                            },
                            {
                                name: 'Freezer',
                                file: '009-freezer.svg',
                                link: '/../icons/009-freezer.svg'
                            },
                        ];
                        $('div.form-group.component').removeClass('hidden');
                        $("#componentValueRange").slider({
                            min: -50,
                            max: 300,
                            step: 1,
                            value: [$scope.component.range[0], $scope.component.range[1]],
                            enabled: true
                        });
                        $("#componentValueRange").slider('refresh');
                        $("#componentDesiredValue").slider({
                            min: $scope.component.range[0],
                            max: $scope.component.range[1],
                            value: $scope.component.desired,
                            enabled: $scope.component.regulation
                        });
                        $("#componentDesiredValue").slider('refresh');
                        $('button.inputLabel').html('&#x2103');
                        break;
                    case 'Humidity':
                        $scope.icons = [{
                            name: 'Water',
                            file: '008-water.svg',
                            link: '/../icons/008-water.svg'
                        }];
                        $('div.form-group.component').removeClass('hidden');
                        $("#componentValueRange").slider({
                            min: 0,
                            max: 100,
                            step: 1,
                            value: [$scope.component.range[0], $scope.component.range[1]],
                            enabled: true
                        });
                        $("#componentValueRange").slider('refresh');
                        $("#componentDesiredValue").slider({
                            min: $scope.component.range[0],
                            max: $scope.component.range[1],
                            value: $scope.component.desired,
                            enabled: $scope.component.regulation
                        });
                        $("#componentDesiredValue").slider('refresh');
                        $('button.inputLabel').text('%');
                        break;
                    case 'Pressure':
                        $scope.icons = [{
                            name: 'Gauge',
                            file: '001-gauge.svg',
                            link: '/../icons/001-gauge.svg'
                        }];
                        $('div.form-group.component:not(.desiredValue)').removeClass('hidden');
                        $("#componentValueRange").slider({
                            min: 850,
                            max: 1150,
                            step: 1,
                            value: [$scope.component.range[0], $scope.component.range[1]],
                            enabled: true
                        });
                        $("#componentValueRange").slider('refresh');
                        $("#componentDesiredValue").slider({
                            min: $scope.component.range[0],
                            max: $scope.component.range[1],
                            value: $scope.component.desired,
                            enabled: $scope.component.regulation
                        });
                        $("#componentDesiredValue").slider('refresh');
                        $('button.inputLabel').text('hPa');
                        break;
                    case 'Binary Switch':
                        $scope.icons = [{
                                name: 'Garage',
                                file: '002-garage.svg',
                                link: '/../icons/002-garage.svg'
                            },
                            {
                                name: 'Door',
                                file: '003-door.svg',
                                link: '/../icons/003-door.svg'
                            },
                            {
                                name: 'Window',
                                file: '004-window.svg',
                                link: '/../icons/004-window.svg'
                            },
                            {
                                name: 'Light-Bulb',
                                file: '006-light-bulb.svg',
                                link: '/../icons/006-light-bulb.svg'
                            }
                        ];
                        $('div.form-group.component').removeClass('hidden');
                        $("#componentValueRange").slider({
                            min: 0,
                            max: 1,
                            step: 1,
                            value: [$scope.component.range[0], $scope.component.range[1]],
                            enabled: false
                        });
                        $("#componentValueRange").slider('refresh');
                        $("#componentDesiredValue").slider({
                            min: $scope.component.range[0],
                            max: $scope.component.range[1],
                            value: $scope.component.desired,
                            enabled: $scope.component.regulation
                        });
                        $("#componentDesiredValue").slider('refresh');
                        $("#componentResolution").slider('disable');
                        $('button.inputLabel').text('bin');
                        break;
                };
            }
        });
    }

    $scope.initEdit = function() {

        $http.get('/api/user/checklog').then(function(response) {
            if (!response.data.logged || !response.data.user.active) {
                window.location.replace('/')
            } else {
                $scope.user = response.data.user;
            };
        });

        $scope.componentId = $location.$$url.replace('/edit/', '');
        $scope.load();

        $('#componentValueRange').on('change', function() {
            var minVal = $(this).slider('getValue')[0];
            var maxVal = $(this).slider('getValue')[1];
            $("#componentDesiredValue").slider('setAttribute', 'min', minVal);
            $("#componentDesiredValue").slider('setAttribute', 'max', maxVal);
            $("#componentDesiredValue").slider('setValue', Math.floor((minVal + maxVal) / 2));
            $("#componentDesiredValue").slider('refresh');
            if ($('#componentDesiredValueActive').prop('checked')) {
                $("#componentDesiredValue").slider('enable');
            } else {
                $("#componentDesiredValue").slider('disable');
            }
        });

        $('#componentDesiredValueActive').on('change', function() {
            var minVal = $('#componentValueRange').slider('getValue')[0];
            var maxVal = $('#componentValueRange').slider('getValue')[1];
            $("#componentDesiredValue").slider('setAttribute', 'min', minVal);
            $("#componentDesiredValue").slider('setAttribute', 'max', maxVal);
            $("#componentDesiredValue").slider('setValue', Math.floor((minVal + maxVal) / 2));
            $("#componentDesiredValue").slider('refresh');
            if ($(this).prop('checked')) {
                $("#componentDesiredValue").slider('enable');
            } else {
                $("#componentDesiredValue").slider('disable');
            }
        });
    }

    $scope.edit = function() {
        $scope.component.range = $('#componentValueRange').slider('getValue');
        $scope.component.resolution = $('#componentResolution').slider('getValue');
        $scope.component.desired = $('#componentDesiredValue').slider('getValue');
        if ($scope.component.name == "") {
            $('#finalMessage').text('Name has to be defined!');
            $('#componentName').parent().addClass('has-error');
        } else if ($scope.component.icon == "") {
            $('#componentName').parent().removeClass('has-error');
            $('#finalMessage').text('Icon has to be chosen!');
        } else {
            $('#componentName').parent().removeClass('has-error');
            $('#finalMessage').text('Loading...');
            $('button[type=submit]').prop('disabled', true);

            $http.post('/api/component/edit', $scope.component).then(function(response) {
                $('#finalMessage').text(response.data.message);
                if (response.data.edited === true) {
                    setTimeout(function() {
                        $scope.load();
                        $('#finalMessage').text('');
                        $('button[type=submit]').prop('disabled', false);
                    }, 1500);

                } else if (Array.isArray(response.data.danger)) {
                    for (eachElement in response.data.danger) {
                        $('#' + response.data.danger[eachElement]).parent().addClass('has-error');
                    }
                    $('button[type=submit]').prop('disabled', false);
                } else {
                    $('button[type=submit]').prop('disabled', false);
                }
            });
        }
    }
}]);