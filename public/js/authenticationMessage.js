var app = angular.module('intBuildApp');

app.controller('AuthenticationMessageController', ['$scope', '$http', '$location', '$stateParams', function($scope, $http, $location, $stateParams) {
    $scope.initAuthenticationMessage = function() {
        /* Get variables from url */
        var matches = $location.$$url.match(/^\/authentication\/(.*)\/(.*)/);
        $scope.authenticationData = {
            username: matches[1],
            hash: matches[2]
        }
        $http.get('/api/user/authenticate/' + matches[1] + '/' + matches[2]).then(function(response) {
            $('#message').text(response.data.message);
            setTimeout(function() {
                window.location.replace('#!/login');
            }, 4000);
        });
    }

    $scope.redirect = function() {
        /*Redirect to login page */
        window.location.replace('#!/login');
    }
}]);