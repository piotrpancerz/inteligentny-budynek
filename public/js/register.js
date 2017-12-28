var app = angular.module('intBuildApp');

app.controller('RegisterController', ['$scope', '$http', '$location', '$stateParams', function($scope, $http, $location, $stateParams) {
    $scope.checkIfLogged = function() {
        $http.get('/api/user/checklog').then(function(response) {
            if (response.data.logged) {
                window.location.replace('#!/home')
            };
        })
    }
    $scope.register = function() {
        /* Reset form */
        $('.has-error').each(function() {
            $(this).removeClass('has-error');
        });
        $('#errorMessage').text('');

        if ($('#password').val() === $('#passwordConfirm').val()) {
            $http.post('/api/user/register', $scope.user).then(function(response) {
                if (response.data.registered === true) {
                    window.location.replace('#!/login');
                } else if (Array.isArray(response.data.danger)) {
                    for (eachElement in response.data.danger) {
                        $('#' + response.data.danger[eachElement]).parent().addClass('has-error');
                        $('#errorMessage').text(response.data.registered);
                    }
                }
            })
        } else {
            $('#password').parent().addClass('has-error');
            $('#passwordConfirm').parent().addClass('has-error');
            $('#password').val('');
            $('#passwordConfirm').val('');
            $('#errorMessage').text('Passwords did not match!');
        }

    }
}]);