var app = angular.module('intBuildApp');

app.controller('RegisterController', ['$scope', '$http', '$location', '$stateParams', function($scope, $http, $location, $stateParams) {
    /* Check if user is logged in */
    $scope.checkIfLogged = function() {
        $http.get('/api/user/checklog').then(function(response) {
            if (response.data.logged) {
                window.location.replace('#!/components')
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

        /* Handle passwords mismatch error or send registration data */
        if ($('#password').val() === $('#passwordConfirm').val()) {
            /* Send registration data to server */
            $http.post('/api/user/register', $scope.user).then(function(response) {
                if (response.data.registered === true) {
                    $('#errorMessage').text('Successfully registered! Redirecting to login page...');
                    setTimeout(function() {
                        window.location.replace('#!/login');
                    }, 1500);
                } else if (Array.isArray(response.data.danger)) {
                    /* Handle database errors */
                    for (eachElement in response.data.danger) {
                        $('#' + response.data.danger[eachElement]).parent().addClass('has-error');
                        $('#errorMessage').text(response.data.registered);
                    }
                    $('button[type=submit]').prop('disabled', false);
                }
            })
        } else {
            /* Handle passwords mismatch error */
            $('#password').parent().addClass('has-error');
            $('#passwordConfirm').parent().addClass('has-error');
            $('#password').val('');
            $('#passwordConfirm').val('');
            $('#errorMessage').text('Passwords did not match!');
            $('button[type=submit]').prop('disabled', false);
        }

    }
}]);