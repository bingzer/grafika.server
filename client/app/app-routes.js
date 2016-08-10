var GrafikaApp;
(function (GrafikaApp) {
    var Routes = (function () {
        function Routes($stateProvider, $urlRouterProvider, $locationProvder, $controller) {
            $stateProvider
                .state('home', {
                url: '/',
                templateUrl: 'app/layout/home.html'
            })
                .state('login', {
                url: '/login',
                templateUrl: 'app/account/login.html',
                controller: 'LoginController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Login'
                }
            })
                .state('profile', {
                url: '/profile',
                templateUrl: 'app/account/profile.html',
                controller: 'ProfileController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Profile'
                }
            })
                .state('settings', {
                url: '/settings',
                templateUrl: 'app/account/settings.html',
                controller: 'SettingsController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Settings'
                }
            })
                .state('my-animations', {
                url: '/animations/mine',
                templateUrl: 'app/animation/mine.html',
                controller: 'MyAnimationsController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'My Animation'
                }
            })
                .state('detail', {
                url: '/animations/:_id',
                templateUrl: 'app/animation/detail.html',
                controller: 'AnimationDetailController',
                controllerAs: 'vm'
            })
                .state('drawing', {
                url: '/animations/:_id/drawing',
                templateUrl: 'app/animation/drawing.html',
                controller: 'AnimationDrawingController',
                controllerAs: 'vm'
            })
                .state('user', {
                url: '/users/:_id',
                templateUrl: 'app/users/user.html',
                controller: 'UserController',
                controllerAs: 'vm'
            });
            $urlRouterProvider.otherwise('/');
            $locationProvder.html5Mode(true);
        }
        Routes.$inject = [
            '$stateProvider',
            '$urlRouterProvider',
            '$locationProvider'
        ];
        return Routes;
    }());
    GrafikaApp.Routes = Routes;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=app-routes.js.map