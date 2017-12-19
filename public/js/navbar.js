var app = angular.module('intBuildApp');

app.controller('NavbarController', function($scope, $http, $location, $routeParams) {
    var vm = this;
    $scope.reloadRoute = function() { window.location.reload(); }
        /* Define navbar content */
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
        case '/components':
            break;
        case '/charts':
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
    console.log('yy');
});