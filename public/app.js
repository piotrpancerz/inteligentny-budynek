var app = angular.module('intBuildApp', ['ui.router', 'nya.bootstrap.select']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('main', {
            url: '/',
            views: {
                'navbar': {
                    templateUrl: './views/navbar.html',
                    controller: 'NavbarController'
                },
                'content': {
                    templateUrl: './views/main.html',
                    controller: 'MainController'
                }
            }
        })
        .state('home', {
            url: '/home',
            views: {
                'navbar': {
                    templateUrl: './views/navbar.html',
                    controller: 'NavbarController'
                },
                'content': {
                    templateUrl: './views/home.html',
                    controller: 'HomeController'
                }
            }
        })
        .state('login', {
            url: '/login',
            views: {
                'navbar': {
                    templateUrl: './views/navbar.html',
                    controller: 'NavbarController'
                },
                'content': {
                    templateUrl: './views/login.html',
                    controller: 'LoginController'
                }
            }
        })
        .state('register', {
            url: '/register',
            views: {
                'navbar': {
                    templateUrl: './views/navbar.html',
                    controller: 'NavbarController'
                },
                'content': {
                    templateUrl: './views/register.html',
                    controller: 'RegisterController'
                }
            }
        })
        .state('components', {
            url: '/components',
            views: {
                'navbar': {
                    templateUrl: './views/navbar.html',
                    controller: 'NavbarController'
                },
                'content': {
                    templateUrl: './views/components.html',
                    controller: 'ComponentsController'
                }
            }
        })
        .state('charts', {
            url: '/charts',
            views: {
                'navbar': {
                    templateUrl: './views/navbar.html',
                    controller: 'NavbarController'
                },
                'content': {
                    templateUrl: './views/charts.html',
                    controller: 'ChartsController'
                }
            }
        })
        .state('add', {
            url: '/add',
            views: {
                'navbar': {
                    templateUrl: './views/navbar.html',
                    controller: 'NavbarController'
                },
                'content': {
                    templateUrl: './views/add.html',
                    controller: 'AddController'
                }
            }
        })
        .state('edit', {
            url: '/edit',
            views: {
                'navbar': {
                    templateUrl: './views/navbar.html',
                    controller: 'NavbarController'
                },
                'content': {
                    templateUrl: './views/edit.html',
                    controller: 'EditController'
                }
            }
        }).state('remove', {
            url: '/remove',
            views: {
                'navbar': {
                    templateUrl: './views/navbar.html',
                    controller: 'NavbarController'
                },
                'content': {
                    templateUrl: './views/remove.html',
                    controller: 'RemoveController'
                }
            }
        }).state('authenticate', {
            url: '/authenticate',
            views: {
                'navbar': {
                    templateUrl: './views/navbar.html',
                    controller: 'NavbarController'
                },
                'content': {
                    templateUrl: './views/authenticate.html',
                    controller: 'AuthenticateController'
                }
            }
        });
    $urlRouterProvider.when('/', '/login', '/register', '/home', '/components', '/charts', '/add', '/edit', '/remove', '/authenticate').otherwise('/')
}]);