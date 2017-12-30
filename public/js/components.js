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
                $('div.form-group:not(.message)').addClass('hidden');
                $('div.message').removeClass('hidden');
                $('#finalMessage').text(reponse.data.message);
            } else if (response.data.components === undefined || response.data.components.length == 0) {
                $('div.form-group:not(.message)').addClass('hidden');
                $('div.message').removeClass('hidden');
                $('#finalMessage').text('There is no components to show.');
            } else {
                $scope.components = response.data.components;
            }
        });
    }
}]);