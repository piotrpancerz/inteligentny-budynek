var app = angular.module('intBuildApp');

app.controller('NavbarController', function($scope, $http, $location) {
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
                'name': '',
                'link': '',
                'class': '',
                'icon': 'fa-plus'
            }, {
                'name': '',
                'link': '',
                'class': '',
                'icon': 'fa-pencil'
            }, {
                'name': '',
                'link': '',
                'class': '',
                'icon': 'fa-remove'
            }];
            break;
        default:
            $scope.navbarRight = [];
            break;

    }
});