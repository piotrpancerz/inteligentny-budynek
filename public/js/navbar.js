var app = angular.module('intBuildApp');

app.controller('NavbarController', function($scope, $http, $location) {
    $scope.logout = function() {
        $http.get('/api/user/logout').then(function(response) {
            if (!response.data.logged) {
                window.location.replace('/');
            }
        });
    }
    $scope.add = function() {
        console.log('yy');
    }
    $scope.edit = function() {
        console.log('yy');
    }
    $scope.remove = function() {
        console.log('yy');
    }

    /* Define main navbar content */
    switch ($location.$$url) {
        case '/':
            $scope.navbarMain = [{
                'name': 'Register',
                'link': '#!/register',
                'class': '',
                'icon': 'fa-user-plus'
            }, {
                'name': 'Login',
                'link': '#!/login',
                'class': '',
                'icon': 'fa-sign-in'
            }];
            break;
        case '/login':
        case '/register':
            $scope.navbarMain = [{
                'name': 'Go Back',
                'link': '#!/',
                'class': '',
                'icon': 'fa-chevron-left'
            }];
            break;
        case '/home':
            $scope.navbarMain = [{
                'name': 'Home',
                'link': '#!/home',
                'class': 'active',
                'icon': 'fa-home'
            }, {
                'name': 'Components',
                'link': '#!/components',
                'class': '',
                'icon': 'fa-list'
            }, {
                'name': 'Charts',
                'link': '#!/charts',
                'class': '',
                'icon': 'fa-line-chart'
            }];
            break;
        case '/components':
            $scope.navbarMain = [{
                'name': 'Home',
                'link': '#!/home',
                'class': '',
                'icon': 'fa-home'
            }, {
                'name': 'Components',
                'link': '#!/components',
                'class': 'active',
                'icon': 'fa-list'
            }, {
                'name': 'Charts',
                'link': '#!/charts',
                'class': '',
                'icon': 'fa-line-chart'
            }];
            break;
        case '/charts':
            $scope.navbarMain = [{
                'name': 'Home',
                'link': '#!/home',
                'class': '',
                'icon': 'fa-home'
            }, {
                'name': 'Components',
                'link': '#!/components',
                'class': '',
                'icon': 'fa-list'
            }, {
                'name': 'Charts',
                'link': '#!/charts',
                'class': 'active',
                'icon': 'fa-line-chart'
            }];
            break;
        default:
            $scope.navbarMain = [{
                'name': 'Register',
                'link': '#!/register',
                'class': '',
                'icon': 'fa-user-plus'
            }, {
                'name': 'Login',
                'link': '#!/login',
                'class': '',
                'icon': 'fa-sign-in'
            }];
            break;
    }
    /* Define right navbar content */
    switch ($location.$$url) {
        case '/home':
        case '/components':
        case '/charts':
            $scope.navbarRight = [{
                'name': 'Add',
                'click': $scope.testAction,
                'class': '',
                'icon': 'fa-plus'
            }, {
                'name': 'Edit',
                'click': $scope.testAction,
                'class': '',
                'icon': 'fa-pencil'
            }, {
                'name': 'Remove',
                'click': $scope.testAction,
                'class': '',
                'icon': 'fa-remove'
            }, {
                'name': 'Logout',
                'click': $scope.logout,
                'class': '',
                'icon': 'fa-sign-out'
            }];
            break;
        default:
            $scope.navbarRight = [];
            break;

    }
});