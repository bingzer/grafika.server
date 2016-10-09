var GrafikaApp;
(function (GrafikaApp) {
    var Routes = (function () {
        function Routes($stateProvider, $urlRouterProvider, $locationProvder, $controller) {
            $stateProvider
                .state('home', {
                url: '/',
                templateUrl: 'app/layout/home.html',
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
                    pageTitle: 'Profile',
                    roles: ['user']
                }
            })
                .state('settings', {
                url: '/settings',
                templateUrl: 'app/account/settings.html',
                controller: 'SettingsController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Settings',
                    roles: ['user']
                }
            })
                .state('my-animations', {
                url: '/animations/mine',
                templateUrl: 'app/animation/mine.html',
                controller: 'MyAnimationsController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'My Animation',
                    roles: ['user']
                }
            })
                .state('admin', {
                url: '/admin',
                templateUrl: 'app/admin/admin.html',
                controller: 'AdminController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Grafika Administration',
                    roles: ['administrator']
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
                controllerAs: 'vm',
                data: {
                    roles: ['user']
                }
            })
                .state('user', {
                url: '/users/:_id',
                templateUrl: 'app/users/user.html',
                controller: 'UserController',
                controllerAs: 'vm'
            })
                .state('r', {
                url: '/r',
                templateProvider: function (appCommon) { return appCommon.navigateHome(); }
            })
                .state('about', { url: '/about', templateUrl: 'app/content/about.html', data: { pageTitle: 'About Grafika' } })
                .state('about.animation', { url: '/animation', templateUrl: 'app/content/animation.html', data: { pageTitle: 'Animation' } })
                .state('about.feedback', { url: '/feedback', templateUrl: 'app/content/feedback.html', data: { pageTitle: 'Feedback' } })
                .state('about.android', { url: '/android', templateUrl: 'app/content/android.html', data: { pageTitle: 'Android App' } })
                .state('stickdraw', { url: '/stickdraw', templateUrl: 'app/content/stickdraw.html', data: { pageTitle: 'Stickdraw (Goodbye!)' } })
                .state('help', { url: '/help', templateUrl: 'app/content/help.html', data: { pageTitle: 'Help' } })
                .state('privacy', { url: '/privacy', templateUrl: 'app/content/privacy.html', data: { pageTitle: 'Privacy' } })
                .state('eula', { url: '/eula', templateUrl: 'app/content/eula.html', data: { pageTitle: 'EULA' } });
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