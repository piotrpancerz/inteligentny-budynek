var app = angular.module('intBuildApp');

app.controller('RemoveController', ['$scope', '$http', '$location', '$stateParams', function($scope, $http, $location, $stateParams) {
    $scope.initRemove = function() {
        $http.get('/api/user/checklog').then(function(response) {
            if (!response.data.logged || !response.data.user.active) {
                window.location.replace('/')
            } else {
                $scope.user = response.data.user;
            };
        });
        $http.get('/api/components/get').then(function(response) {
            if (!response.data.found) {
                $('div.form-group:not(.message)').addClass('hidden');
                $('#finalMessage').text(reponse.data.message);
            } else {
                $scope.components = response.data.components;
                if ($scope.components === undefined || $scope.components.length == 0) {
                    $('div.form-group:not(.message)').addClass('hidden');
                    $('div.message').removeClass('hidden');
                    $('#finalMessage').text('There is no components to remove.');
                }
            }
        });
        $('#selectComponent').on('change', function() {
            if ($scope.selectedComponent) {
                $('div.form-group').removeClass('hidden');
            } else {
                $('div.form-group:not(.mainSelect)').addClass('hidden');
            }
        })
    }

    $scope.remove = function() {
        $('#finalMessage').text('Loading...');
        $('button[type=submit]').prop('disabled', true);
        $http.post('/api/component/delete', $scope.selectedComponent).then(function(response) {
            $('#finalMessage').text(response.data.message);
            if (response.data.deleted === true) {
                setTimeout(function() {
                    $http.get('/api/components/get').then(function(response) {
                        if (!response.data.found) {
                            $('div.form-group:not(.message)').addClass('hidden');
                            $('#finalMessage').text(reponse.data.message);
                        } else {
                            $scope.components = response.data.components;
                            if ($scope.components === undefined || $scope.components.length == 0) {
                                $('div.form-group:not(.message)').addClass('hidden');
                                $('div.message').removeClass('hidden');
                                $('#finalMessage').text('There is no components to remove.');
                            }
                        }
                    });
                    $('div.form-group:not(.mainSelect').addClass('hidden');
                    $scope.selectedComponent = undefined
                    $scope.$apply();
                    $('#finalMessage').text('');
                    $('button[type=submit]').prop('disabled', false);
                }, 1500);
            } else {
                $('button[type=submit]').prop('disabled', false);
            }
        });
    }
}]);