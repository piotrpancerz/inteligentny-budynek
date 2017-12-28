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
            case '/add':
            case '/edit':
            case '/remove':
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
                    'class': '',
                    'icon': 'fa-line-chart'
                }];
                break;
            case '/authenticate':
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
                    'name': 'Edit',
                    'click': $scope.edit,
                    'class': '',
                    'icon': 'fa-pencil'
                }, {
                    'name': 'Remove',
                    'click': $scope.remove,
                    'class': '',
                    'icon': 'fa-remove'
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
                    'name': 'Edit',
                    'click': $scope.edit,
                    'class': '',
                    'icon': 'fa-pencil'
                }, {
                    'name': 'Remove',
                    'click': $scope.remove,
                    'class': '',
                    'icon': 'fa-remove'
                }, {
                    'name': 'Logout',
                    'click': $scope.logout,
                    'class': '',
                    'icon': 'fa-sign-out'
                }];
                break;
            case '/edit':
                $scope.navbarRight = [{
                    'name': 'Add',
                    'click': $scope.add,
                    'class': '',
                    'icon': 'fa-plus'
                }, {
                    'name': 'Edit',
                    'click': $scope.edit,
                    'class': 'active',
                    'icon': 'fa-pencil'
                }, {
                    'name': 'Remove',
                    'click': $scope.remove,
                    'class': '',
                    'icon': 'fa-remove'
                }, {
                    'name': 'Logout',
                    'click': $scope.logout,
                    'class': '',
                    'icon': 'fa-sign-out'
                }];
                break;
            case '/remove':
                $scope.navbarRight = [{
                    'name': 'Add',
                    'click': $scope.add,
                    'class': '',
                    'icon': 'fa-plus'
                }, {
                    'name': 'Edit',
                    'click': $scope.edit,
                    'class': '',
                    'icon': 'fa-pencil'
                }, {
                    'name': 'Remove',
                    'click': $scope.remove,
                    'class': 'active',
                    'icon': 'fa-remove'
                }, {
                    'name': 'Logout',
                    'click': $scope.logout,
                    'class': '',
                    'icon': 'fa-sign-out'
                }];
                break;
            case '/authenticate':
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
    $scope.edit = function() {
        window.location.replace('#!/edit');
    }
    $scope.remove = function() {
        window.location.replace('#!/remove');
    }

});