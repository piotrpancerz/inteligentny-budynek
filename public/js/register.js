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
        $('#errorMessage').text('Loading...');
        $('button[type=submit]').prop('disabled', true);
        /* Reset form */
        $('.has-error').each(function() {
            $(this).removeClass('has-error');
        });

        if ($('#password').val() === $('#passwordConfirm').val()) {
            $http.post('/api/user/register', $scope.user).then(function(response) {
                if (response.data.registered === true) {
                    $('#errorMessage').text('Successfully registered! Redirecting to login page...');
                    setTimeout(function() {
                        window.location.replace('#!/login');
                    }, 1500);
                } else if (Array.isArray(response.data.danger)) {
                    for (eachElement in response.data.danger) {
                        $('#' + response.data.danger[eachElement]).parent().addClass('has-error');
                        $('#errorMessage').text(response.data.registered);
                    }
                    $('button[type=submit]').prop('disabled', false);
                }
            })
        } else {
            $('#password').parent().addClass('has-error');
            $('#passwordConfirm').parent().addClass('has-error');
            $('#password').val('');
            $('#passwordConfirm').val('');
            $('#errorMessage').text('Passwords did not match!');
            $('button[type=submit]').prop('disabled', false);
        }

    }
}]);