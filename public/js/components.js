var app = angular.module('intBuildApp');

app.controller('ComponentsController', ['$scope', '$http', '$location', '$stateParams', function($scope, $http, $location, $stateParams) {
    $scope.initComponents = function() {

        $http.get('/api/user/checklog').then(function(response) {
            if (!response.data.logged || !response.data.user.active) {
                window.location.replace('/')
            } else {
                $scope.user = response.data.user;
            };
        });
        $scope.load();
    }

    $scope.load = function() {
        $http.get('/api/components/get').then(function(response) {
            if (!response.data.found) {
                $('.form-group:not(.message):not(.button)').addClass('hidden');
                $('div.message').removeClass('hidden');
                $('#finalMessage').text(reponse.data.message);
            } else if (response.data.components === undefined || response.data.components.length == 0) {
                $('.form-group:not(.message):not(.button)').addClass('hidden');
                $('div.message').removeClass('hidden');
                $('#finalMessage').text('There is no components to show.');
            } else {
                $('.form-group:not(.message)').removeClass('hidden');
                $('.form-group.message').addClass('hidden');
                $('#finalMessage').text('');
                $scope.components = response.data.components;
                for (eachComponent in $scope.components) {
                    var currentValueIndex = $scope.components[eachComponent].data.length - 1;
                    $scope.components[eachComponent].currentValue = $scope.components[eachComponent].data[currentValueIndex];
                    switch ($scope.components[eachComponent].type) {
                        case 'Temperature':
                            $scope.components[eachComponent].currentValue += ' &#x2103';
                            break;
                        case 'Humidity':
                            $scope.components[eachComponent].currentValue += ' %';
                            break;
                        case 'Pressure':
                            $scope.components[eachComponent].currentValue += ' hPa';
                            break;
                        case 'Binary Switch':
                            if ($scope.components[eachComponent].currentValue == 0) {
                                $scope.components[eachComponent].currentValue = 'off';
                            } else {
                                $scope.components[eachComponent].currentValue = 'on';
                            }
                            break;
                    }
                }
            }
        });
    }
}]);