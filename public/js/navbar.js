var app = angular.module('intBuildApp');

app.controller('NavbarController', function($scope, $http, $location) {
    $scope.checkIfLogged = function() {
        $http.get('/api/user/checklog').then(function(response) {
            if (response.data.logged) {
                $scope.user = response.data.user;
                // if ($scope.navbarHeader === 'Intelligent Building') {
                // $scope.navbarHeader = 'Intelligent Building - ' + $scope.user.username;
                // }
            } else {
                // if ($scope.navbarHeader.indexOf('-') >= 0) {
                // $scope.navbarHeader = 'Intelligent Building';
                // }
            }
        })
    }
    $scope.initNavbar = function() {
        $scope.navbarHeader = 'Intelligent Builiding';
        $scope.checkIfLogged();
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
                }];
                break;
            case ($location.$$url.match(/^\/chart\//) || {}).input:
                $scope.navbarMain = [{
                    'name': 'Go Back',
                    'link': '#!/components',
                    'class': '',
                    'icon': 'fa-chevron-left'
                }, {
                    'name': 'Charts',
                    'link': $location.$$url,
                    'class': 'active',
                    'icon': 'fa-line-chart'
                }, {
                    'name': 'Edit',
                    'link': '#!' + $location.$$url.replace('chart', 'edit'),
                    'class': '',
                    'icon': 'fa-pencil'
                }, {
                    'name': 'Remove',
                    'link': '#!' + $location.$$url.replace('chart', 'remove'),
                    'class': '',
                    'icon': 'fa-remove'
                }];
                break;
            case ($location.$$url.match(/^\/edit\//) || {}).input:
                $scope.navbarMain = [{
                    'name': 'Go Back',
                    'link': '#!/components',
                    'class': '',
                    'icon': 'fa-chevron-left'
                }, {
                    'name': 'Charts',
                    'link': '#!' + $location.$$url.replace('edit', 'chart'),
                    'class': '',
                    'icon': 'fa-line-chart'
                }, {
                    'name': 'Edit',
                    'link': $location.$$url,
                    'class': 'active',
                    'icon': 'fa-pencil'
                }, {
                    'name': 'Remove',
                    'link': '#!' + $location.$$url.replace('edit', 'remove'),
                    'class': '',
                    'icon': 'fa-remove'
                }];
                break;
            case ($location.$$url.match(/^\/remove\//) || {}).input:
                $scope.navbarMain = [{
                    'name': 'Go Back',
                    'link': '#!/components',
                    'class': '',
                    'icon': 'fa-chevron-left'
                }, {
                    'name': 'Charts',
                    'link': '#!' + $location.$$url.replace('remove', 'chart'),
                    'class': '',
                    'icon': 'fa-line-chart'
                }, {
                    'name': 'Edit',
                    'link': '#!' + $location.$$url.replace('remove', 'edit'),
                    'class': '',
                    'icon': 'fa-pencil'
                }, {
                    'name': 'Remove',
                    'link': $location.$$url,
                    'class': 'active',
                    'icon': 'fa-remove'
                }];
                break;
            case '/add':
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
                }];
                break;
            case '/authenticate':
            case ($location.$$url.match(/^\/authentication\//) || {}).input:
                $scope.navbarMain = [];
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
                    'click': $scope.add,
                    'class': '',
                    'icon': 'fa-plus'
                }, {
                    'name': 'Logout',
                    'click': $scope.logout,
                    'class': '',
                    'icon': 'fa-sign-out'
                }];
                break;
            case '/add':
                $scope.navbarRight = [{
                    'name': 'Add',
                    'click': $scope.add,
                    'class': 'active',
                    'icon': 'fa-plus'
                }, {
                    'name': 'Logout',
                    'click': $scope.logout,
                    'class': '',
                    'icon': 'fa-sign-out'
                }];
                break;
            case '/authenticate':
            case ($location.$$url.match(/^\/chart\//) || {}).input:
            case ($location.$$url.match(/^\/edit\//) || {}).input:
            case ($location.$$url.match(/^\/remove\//) || {}).input:
                $scope.navbarRight = [{
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
    }
    $scope.logout = function() {
        $http.get('/api/user/logout').then(function(response) {
            if (!response.data.logged) {
                window.location.replace('/');
            }
        });
    }
    $scope.add = function() {
        window.location.replace('#!/add');
    }

});