var app = angular.module('intBuildApp');

app.controller('AddController', ['$scope', '$http', '$location', '$stateParams', function($scope, $http, $location, $stateParams) {
    $scope.initAdd = function() {
        $http.get('/api/user/checklog').then(function(response) {
            if (!response.data.logged || !response.data.user.active) {
                window.location.replace('/')
            };
        });

        $('select').selectpicker();

        $('#componentKindSelect').on('change', function() {
            $('div.form-group.component').addClass('hidden');
            $('#componentDesiredValueActive').prop('checked', false);
            $("#componentResolution").slider({
                min: 0.01,
                max: 10,
                value: 1,
                scale: 'logarithmic',
                step: 0.01,
                ticks: [0.01, 0.1, 1, 10],
                ticks_snap_bounds: 0.1,
                enabled: true
            });
            $("#componentResolution").slider('refresh');
            switch ($(this).val()) {
                case '1':
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
                case '2':
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
                case '3':
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
                case '4':
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
                    $('button.inputLabel').text('bin');
                    break;
            };
        });

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

    $scope.add = function() {
        console.log($scope.component);
    }
}]);