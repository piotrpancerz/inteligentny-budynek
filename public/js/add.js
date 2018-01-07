var app = angular.module('intBuildApp');

app.controller('AddController', ['$scope', '$http', '$location', '$stateParams', function($scope, $http, $location, $stateParams) {
    $scope.initAdd = function() {
        /* Check if user is logged in */
        $http.get('/api/user/checklog').then(function(response) {
            if (!response.data.logged || !response.data.user.active) {
                window.location.replace('/')
            } else {
                $scope.user = response.data.user;
            };
        });

        /* Initialize component object with certain keys */
        $scope.component = {
            name: "",
            type: "",
            range: [],
            resolution: 1,
            desired: 1,
            regulation: false,
            icon: ''
        }

        /* Changes on select option choice change */
        $('#componentKindSelect').on('change', function() {
            $('div.form-group.component').addClass('hidden');
            $('#componentDesiredValueActive').prop('checked', false);
            $("#componentResolution").slider({
                min: 0.01,
                max: 10,
                value: 1,
                scale: 'logarithmic',
                step: 0.01,
                ticks: [0.01, 0.1, 0.5, 1, 5, 10],
                ticks_snap_bounds: 10,
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
                    $scope.$apply();
                    $('div.form-group.component').removeClass('hidden');
                    $("#componentValueRange").slider({
                        min: -50,
                        max: 300,
                        step: 1,
                        value: [-20, 40],
                        enabled: true
                    });
                    $("#componentValueRange").slider('refresh');
                    $("#componentDesiredValue").slider({
                        min: 0,
                        max: 10,
                        enabled: false
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
                    $scope.$apply();
                    $('div.form-group.component').removeClass('hidden');
                    $("#componentValueRange").slider({
                        min: 0,
                        max: 100,
                        step: 1,
                        value: [0, 100],
                        enabled: true
                    });
                    $("#componentValueRange").slider('refresh');
                    $("#componentDesiredValue").slider({ min: 0, max: 10, enabled: false });
                    $("#componentDesiredValue").slider('refresh');
                    $('button.inputLabel').text('%');
                    break;
                case 'Pressure':
                    $scope.icons = [{
                        name: 'Gauge',
                        file: '001-gauge.svg',
                        link: '/../icons/001-gauge.svg'
                    }];
                    $scope.$apply();
                    $('div.form-group.component:not(.desiredValue)').removeClass('hidden');
                    $("#componentValueRange").slider({
                        min: 850,
                        max: 1150,
                        step: 1,
                        value: [850, 1150],
                        enabled: true
                    });
                    $("#componentValueRange").slider('refresh');
                    $("#componentDesiredValue").slider({ min: 0, max: 10, enabled: false });
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
                    $scope.$apply();
                    $('div.form-group.component').removeClass('hidden');
                    $("#componentValueRange").slider({
                        min: 0,
                        max: 1,
                        step: 1,
                        value: [0, 1],
                        enabled: false
                    });
                    $("#componentValueRange").slider('refresh');
                    $("#componentDesiredValue").slider({ min: 0, max: 1, enabled: false });
                    $("#componentDesiredValue").slider('refresh');
                    $("#componentResolution").slider('disable');
                    $('button.inputLabel').text('off/on');
                    break;
            };
        });

        /* Changes on value range slider change */
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

        /* Changes on desired value slider change */
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

    $scope.add = function() {
        /* Gather lacking values to component object */
        $scope.component.range = $('#componentValueRange').slider('getValue');
        $scope.component.resolution = $('#componentResolution').slider('getValue');
        $scope.component.desired = $('#componentDesiredValue').slider('getValue');

        /* Handle missing values (name, icon) and if nothing to handle - disable button Add */
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

            /* Send component object to server and add it */
            $http.post('/api/component/add', $scope.component).then(function(response) {
                $('#finalMessage').text(response.data.message);
                if (response.data.added === true) {
                    setTimeout(function() {
                        window.location.replace('#!/components');
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