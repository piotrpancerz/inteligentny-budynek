var app = angular.module('intBuildApp');

app.controller('RemoveController', ['$scope', '$http', '$location', '$stateParams', function($scope, $http, $location, $stateParams) {
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
            }
        });
    }

    $scope.initRemove = function() {
        /* Check if user is logged in */
        $http.get('/api/user/checklog').then(function(response) {
            if (!response.data.logged || !response.data.user.active) {
                window.location.replace('/')
            } else {
                $scope.user = response.data.user;
            };
        });

        /* Get component id to load from URL */
        $scope.componentId = $location.$$url.replace('/remove/', '');

        /* Load component data */
        $scope.load();
    }

    $scope.remove = function() {
        $('#finalMessage').text('Loading...');
        $('button[type=submit]').prop('disabled', true);
        /* Send component object to server and remove it */
        $http.post('/api/component/delete', $scope.component).then(function(response) {
            $('#finalMessage').text(response.data.message);
            if (response.data.deleted === true) {
                setTimeout(function() {
                    window.location.replace('#!/components');
                }, 1500);
            } else {
                $('button[type=submit]').prop('disabled', false);
            }
        });
    }
}]);